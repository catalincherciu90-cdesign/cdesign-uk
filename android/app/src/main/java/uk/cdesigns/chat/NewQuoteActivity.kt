package uk.cdesigns.chat

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import uk.cdesigns.chat.databinding.ActivityNewquoteBinding
import uk.cdesigns.chat.databinding.ItemServicePickBinding
import java.net.URLEncoder
import java.util.concurrent.Executors

class NewQuoteActivity : AppCompatActivity() {

    private lateinit var b: ActivityNewquoteBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = ServiceAdapter()
    private val selected = LinkedHashSet<String>()
    private var services: List<Service> = emptyList()
    private var currency = "GBP"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { finish(); return }
        b = ActivityNewquoteBinding.inflate(layoutInflater)
        setContentView(b.root)
        b.back.setOnClickListener { finish() }
        b.services.layoutManager = LinearLayoutManager(this)
        b.services.adapter = adapter
        b.save.setOnClickListener { save() }
        updateTotal()
        loadServices()
    }

    private fun loadServices() {
        val token = Prefs.token(this)
        io.execute {
            try {
                val list = Api.listServices(token)
                runOnUiThread {
                    services = list
                    if (list.isNotEmpty()) currency = list[0].moneda
                    adapter.submit(list)
                }
            } catch (e: Exception) {
                runOnUiThread { toast("Couldn't load services.") }
            }
        }
    }

    private fun chosen(): List<Service> = services.filter { selected.contains(it.id) }

    private fun updateTotal() {
        val total = chosen().sumOf { it.pret }
        val cur = chosen().firstOrNull()?.moneda ?: currency
        b.total.text = Money.format(total, cur)
    }

    private fun save() {
        val name = b.clientName.text.toString().trim()
        val picked = chosen()
        if (name.isEmpty()) { b.clientName.error = "Required"; return }
        if (picked.isEmpty()) { toast("Select at least one service."); return }
        val cur = picked.first().moneda
        b.save.isEnabled = false
        val token = Prefs.token(this)
        io.execute {
            try {
                val id = Api.createOffer(
                    token, name,
                    b.clientEmail.text.toString().trim(),
                    b.clientPhone.text.toString().trim(),
                    picked, cur, "30 days", ""
                )
                runOnUiThread {
                    b.save.isEnabled = true
                    offerToOpen(id)
                }
            } catch (e: Exception) {
                runOnUiThread { b.save.isEnabled = true; toast("Could not create the quote.") }
            }
        }
    }

    private fun offerToOpen(id: String) {
        AlertDialog.Builder(this)
            .setTitle("Quote created")
            .setMessage("Open it now to view or share as PDF?")
            .setPositiveButton("Open") { _, _ ->
                val token = Prefs.token(this)
                val url = Prefs.BASE_URL + "/oferta-preview/" + URLEncoder.encode(id, "UTF-8") +
                    "?token=" + URLEncoder.encode(token, "UTF-8")
                try { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (e: Exception) {}
                finish()
            }
            .setNegativeButton("Done") { _, _ -> finish() }
            .show()
    }

    private fun toast(m: String) = android.widget.Toast.makeText(this, m, android.widget.Toast.LENGTH_SHORT).show()

    inner class ServiceAdapter : RecyclerView.Adapter<ServiceAdapter.VH>() {
        private val items = ArrayList<Service>()
        fun submit(list: List<Service>) { items.clear(); items.addAll(list); notifyDataSetChanged() }
        inner class VH(val v: ItemServicePickBinding) : RecyclerView.ViewHolder(v.root)
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
            VH(ItemServicePickBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        override fun getItemCount() = items.size
        override fun onBindViewHolder(h: VH, position: Int) {
            val s = items[position]
            h.v.nume.text = s.nume
            h.v.descriere.text = s.descriere
            h.v.pret.text = Money.format(s.pret, s.moneda) + (if (s.unitate == "lună") "/mo" else "")
            h.v.check.isChecked = selected.contains(s.id)
            h.v.root.setOnClickListener {
                if (selected.contains(s.id)) selected.remove(s.id) else selected.add(s.id)
                h.v.check.isChecked = selected.contains(s.id)
                updateTotal()
            }
        }
    }
}
