package uk.cdesigns.chat

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import uk.cdesigns.chat.databinding.ActivityChatBinding
import uk.cdesigns.chat.databinding.ItemMessageBinding
import java.util.concurrent.Executors

class ChatActivity : AppCompatActivity() {

    private lateinit var b: ActivityChatBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = MsgAdapter()
    private lateinit var cid: String
    private val ui = Handler(Looper.getMainLooper())
    private var polling = false

    private val pollLoop = object : Runnable {
        override fun run() {
            load(false)
            if (polling) ui.postDelayed(this, 5000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        cid = intent.getStringExtra("cid") ?: ""
        if (cid.isEmpty() || Prefs.token(this).isEmpty()) { finish(); return }

        b = ActivityChatBinding.inflate(layoutInflater)
        setContentView(b.root)

        b.messages.layoutManager = LinearLayoutManager(this).apply { stackFromEnd = true }
        b.messages.adapter = adapter
        b.back.setOnClickListener { finish() }
        b.send.setOnClickListener { sendReply() }

        // Clear the notification for this conversation.
        ChatSync.clearNotification(this, cid)
    }

    override fun onResume() {
        super.onResume()
        polling = true
        ui.post(pollLoop)
        markRead()
    }

    override fun onPause() {
        super.onPause()
        polling = false
        ui.removeCallbacks(pollLoop)
    }

    private fun load(scrollToEnd: Boolean) {
        val token = Prefs.token(this)
        io.execute {
            try {
                val d = Api.getConversation(token, cid)
                runOnUiThread {
                    b.title.text = if (d.name.isNotBlank()) d.name else "#" + d.num.toString().padStart(4, '0')
                    b.subtitle.text = if (d.contact.isNotBlank()) d.contact else if (d.mode == "live") "Live" else ""
                    val atBottom = !b.messages.canScrollVertically(1)
                    adapter.submit(d.messages)
                    if ((scrollToEnd || atBottom) && adapter.itemCount > 0) b.messages.scrollToPosition(adapter.itemCount - 1)
                }
            } catch (e: Exception) { /* keep last state on transient errors */ }
        }
    }

    private fun sendReply() {
        val text = b.reply.text.toString().trim()
        if (text.isEmpty()) return
        b.send.isEnabled = false
        val token = Prefs.token(this)
        io.execute {
            try {
                Api.reply(token, cid, text)
                runOnUiThread {
                    b.reply.setText("")
                    b.send.isEnabled = true
                    load(true)
                }
            } catch (e: Exception) {
                runOnUiThread { b.send.isEnabled = true }
            }
        }
    }

    private fun markRead() {
        val token = Prefs.token(this)
        io.execute { try { Api.markRead(token, cid); Prefs.setNotifiedCount(this, cid, 0) } catch (e: Exception) {} }
    }

    // ── Message adapter ────────────────────────────────────────
    inner class MsgAdapter : RecyclerView.Adapter<MsgAdapter.VH>() {
        private val items = ArrayList<Message>()
        fun submit(list: List<Message>) { items.clear(); items.addAll(list); notifyDataSetChanged() }

        inner class VH(val v: ItemMessageBinding) : RecyclerView.ViewHolder(v.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
            return VH(ItemMessageBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        }

        override fun getItemCount() = items.size

        override fun onBindViewHolder(h: VH, position: Int) {
            val m = items[position]
            val isOwner = m.role == "owner"
            h.v.root.gravity = if (isOwner) Gravity.END else Gravity.START
            h.v.label.text = when {
                isOwner -> "You" + (if (m.by.isNotBlank()) " · " + m.by else "")
                m.role == "assistant" -> "AI"
                else -> "Visitor"
            }
            h.v.bubble.text = m.content
            h.v.bubble.setBackgroundResource(if (isOwner) R.drawable.bg_bubble_owner else R.drawable.bg_bubble_visitor)
            h.v.bubble.setTextColor(getColor(if (isOwner) R.color.on_teal else R.color.ink))
        }
    }
}
