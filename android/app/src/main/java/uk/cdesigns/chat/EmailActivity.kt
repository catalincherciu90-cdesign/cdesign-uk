package uk.cdesigns.chat

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import uk.cdesigns.chat.databinding.ActivityEmailBinding
import uk.cdesigns.chat.databinding.ItemSentmailBinding
import java.util.concurrent.Executors

class EmailActivity : AppCompatActivity() {

    private lateinit var b: ActivityEmailBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = SentAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { finish(); return }
        b = ActivityEmailBinding.inflate(layoutInflater)
        setContentView(b.root)

        b.back.setOnClickListener { finish() }
        b.send.setOnClickListener { send() }
        b.sentList.layoutManager = LinearLayoutManager(this)
        b.sentList.adapter = adapter
        loadSent()
    }

    private fun send() {
        val to = b.to.text.toString().trim()
        val subject = b.subject.text.toString().trim()
        val message = b.message.text.toString().trim()
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(to).matches()) { status("Enter a valid recipient email.", true); return }
        if (subject.isEmpty() || message.isEmpty()) { status("Subject and message are required.", true); return }
        b.send.isEnabled = false
        status("Sending…", false)
        val token = Prefs.token(this)
        io.execute {
            try {
                Api.sendMail(token, to, subject, message)
                runOnUiThread {
                    b.send.isEnabled = true
                    status("✓ Sent to $to", false)
                    b.subject.setText(""); b.message.setText("")
                    loadSent()
                }
            } catch (e: Api.ApiException) {
                runOnUiThread { b.send.isEnabled = true; status("Could not send (${e.code}).", true) }
            } catch (e: Exception) {
                runOnUiThread { b.send.isEnabled = true; status("Network error — not sent.", true) }
            }
        }
    }

    private fun loadSent() {
        val token = Prefs.token(this)
        io.execute {
            try {
                val list = Api.listSentMail(token)
                runOnUiThread { adapter.submit(list) }
            } catch (e: Exception) { /* ignore */ }
        }
    }

    private fun status(msg: String, error: Boolean) {
        b.status.text = msg
        b.status.setTextColor(getColor(if (error) android.R.color.holo_red_dark else R.color.teal_dk))
        b.status.visibility = View.VISIBLE
    }

    inner class SentAdapter : RecyclerView.Adapter<SentAdapter.VH>() {
        private val items = ArrayList<SentMail>()
        fun submit(list: List<SentMail>) { items.clear(); items.addAll(list.take(20)); notifyDataSetChanged() }
        inner class VH(val v: ItemSentmailBinding) : RecyclerView.ViewHolder(v.root)
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
            VH(ItemSentmailBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        override fun getItemCount() = items.size
        override fun onBindViewHolder(h: VH, position: Int) {
            val m = items[position]
            h.v.subject.text = if (m.subject.isNotBlank()) m.subject else "(no subject)"
            val state = if (m.status == "sent") "✓ sent" else "✗ failed"
            h.v.meta.text = m.to + " · " + state
        }
    }
}
