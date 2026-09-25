package uk.cdesigns.chat

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import uk.cdesigns.chat.databinding.ActivityQuotesBinding
import uk.cdesigns.chat.databinding.ItemQuoteBinding
import java.net.URLEncoder
import java.util.concurrent.Executors

class QuotesActivity : AppCompatActivity() {

    private lateinit var b: ActivityQuotesBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = QuoteAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { finish(); return }
        b = ActivityQuotesBinding.inflate(layoutInflater)
        setContentView(b.root)
        b.back.setOnClickListener { finish() }
        b.add.setOnClickListener { startActivity(Intent(this, NewQuoteActivity::class.java)) }
        b.list.layoutManager = LinearLayoutManager(this)
        b.list.adapter = adapter
    }

    override fun onResume() {
        super.onResume()
        load()
    }

    private fun load() {
        val token = Prefs.token(this)
        io.execute {
            try {
                val list = Api.listOffers(token)
                runOnUiThread {
                    adapter.submit(list)
                    b.empty.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) { /* ignore */ }
        }
    }

    private fun openPreview(o: Offer) {
        val token = Prefs.token(this)
        val url = Prefs.BASE_URL + "/oferta-preview/" + URLEncoder.encode(o.id, "UTF-8") +
            "?token=" + URLEncoder.encode(token, "UTF-8")
        try { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }
        catch (e: Exception) { android.widget.Toast.makeText(this, "Couldn't open the quote.", android.widget.Toast.LENGTH_SHORT).show() }
    }

    inner class QuoteAdapter : RecyclerView.Adapter<QuoteAdapter.VH>() {
        private val items = ArrayList<Offer>()
        fun submit(list: List<Offer>) { items.clear(); items.addAll(list); notifyDataSetChanged() }
        inner class VH(val v: ItemQuoteBinding) : RecyclerView.ViewHolder(v.root)
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
            VH(ItemQuoteBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        override fun getItemCount() = items.size
        override fun onBindViewHolder(h: VH, position: Int) {
            val o = items[position]
            h.v.numar.text = o.numar
            h.v.total.text = Money.format(o.total, o.moneda)
            h.v.client.text = if (o.clientName.isNotBlank()) o.clientName else "—"
            h.v.meta.text = o.status
            h.v.root.setOnClickListener { openPreview(o) }
        }
    }
}
