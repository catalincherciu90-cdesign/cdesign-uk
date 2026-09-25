package uk.cdesigns.chat

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import uk.cdesigns.chat.databinding.ActivityMainBinding
import uk.cdesigns.chat.databinding.ItemConversationBinding
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private lateinit var b: ActivityMainBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = ConvAdapter()

    private val notifPerm = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { goToLogin(); return }

        b = ActivityMainBinding.inflate(layoutInflater)
        setContentView(b.root)

        b.list.layoutManager = LinearLayoutManager(this)
        b.list.adapter = adapter
        b.swipe.setOnRefreshListener { load() }
        b.logout.setOnClickListener { logout() }

        askNotifPermission()
        ChatSync.startService(this)
        openFromIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        openFromIntent(intent)
    }

    override fun onResume() {
        super.onResume()
        load()
    }

    private fun openFromIntent(intent: Intent?) {
        val cid = intent?.getStringExtra("cid") ?: return
        if (cid.isNotEmpty()) {
            startActivity(Intent(this, ChatActivity::class.java).putExtra("cid", cid))
        }
    }

    private fun askNotifPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) notifPerm.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    private fun load() {
        val token = Prefs.token(this)
        if (token.isEmpty()) { goToLogin(); return }
        b.swipe.isRefreshing = true
        io.execute {
            try {
                val list = Api.listConversations(token)
                runOnUiThread {
                    b.swipe.isRefreshing = false
                    adapter.submit(list)
                    b.empty.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Api.ApiException) {
                runOnUiThread {
                    b.swipe.isRefreshing = false
                    if (e.code == 401) { Prefs.clear(this); goToLogin() }
                }
            } catch (e: Exception) {
                runOnUiThread { b.swipe.isRefreshing = false }
            }
        }
    }

    private fun logout() {
        Prefs.clear(this)
        ChatSync.stopService(this)
        goToLogin()
    }

    private fun goToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }

    // ── Adapter ────────────────────────────────────────────────
    inner class ConvAdapter : RecyclerView.Adapter<ConvAdapter.VH>() {
        private val items = ArrayList<Conversation>()
        fun submit(list: List<Conversation>) { items.clear(); items.addAll(list); notifyDataSetChanged() }

        inner class VH(val v: ItemConversationBinding) : RecyclerView.ViewHolder(v.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
            return VH(ItemConversationBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        }

        override fun getItemCount() = items.size

        override fun onBindViewHolder(h: VH, position: Int) {
            val c = items[position]
            h.v.name.text = if (c.name.isNotBlank()) c.name else "#" + c.num.toString().padStart(4, '0')
            h.v.preview.text = if (c.preview.isNotBlank()) c.preview else "—"
            h.v.time.text = fmtTime(c.updated)
            val metaBits = ArrayList<String>()
            metaBits.add("#" + c.num.toString().padStart(4, '0'))
            if (c.geo.isNotBlank()) metaBits.add(c.geo)
            h.v.meta.text = metaBits.joinToString(" · ")
            when {
                c.ownerUnread > 0 -> { h.v.badge.visibility = View.VISIBLE; h.v.badge.text = "● " + c.ownerUnread + " NEW" }
                c.mode == "live" -> { h.v.badge.visibility = View.VISIBLE; h.v.badge.text = "LIVE" }
                else -> h.v.badge.visibility = View.GONE
            }
            h.v.root.setOnClickListener {
                startActivity(Intent(this@MainActivity, ChatActivity::class.java).putExtra("cid", c.id))
            }
        }
    }

    private fun fmtTime(iso: String): String {
        return try {
            val dt = LocalDateTime.ofInstant(Instant.parse(iso), ZoneId.systemDefault())
            if (dt.toLocalDate() == LocalDate.now()) dt.format(DateTimeFormatter.ofPattern("HH:mm"))
            else dt.format(DateTimeFormatter.ofPattern("d MMM"))
        } catch (e: Exception) { "" }
    }
}
