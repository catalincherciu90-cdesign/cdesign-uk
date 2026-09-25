package uk.cdesigns.chat

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import uk.cdesigns.chat.databinding.ActivityServicesBinding
import uk.cdesigns.chat.databinding.ItemServiceBinding
import java.util.concurrent.Executors

class ServicesActivity : AppCompatActivity() {

    private lateinit var b: ActivityServicesBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = SvcAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { finish(); return }
        b = ActivityServicesBinding.inflate(layoutInflater)
        setContentView(b.root)
        b.back.setOnClickListener { finish() }
        b.add.setOnClickListener { editDialog(null) }
        b.list.layoutManager = LinearLayoutManager(this)
        b.list.adapter = adapter
        load()
    }

    private fun load() {
        val token = Prefs.token(this)
        io.execute {
            try {
                val list = Api.listServices(token)
                runOnUiThread {
                    adapter.submit(list)
                    b.empty.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) { /* ignore */ }
        }
    }

    private fun editDialog(existing: Service?) {
        val v = layoutInflater.inflate(R.layout.dialog_service, null)
        val nume = v.findViewById<EditText>(R.id.nume)
        val descriere = v.findViewById<EditText>(R.id.descriere)
        val pret = v.findViewById<EditText>(R.id.pret)
        val moneda = v.findViewById<EditText>(R.id.moneda)
        val unitate = v.findViewById<EditText>(R.id.unitate)
        val categorie = v.findViewById<EditText>(R.id.categorie)
        if (existing != null) {
            nume.setText(existing.nume); descriere.setText(existing.descriere)
            pret.setText(if (existing.pret == existing.pret.toLong().toDouble()) existing.pret.toLong().toString() else existing.pret.toString())
            moneda.setText(existing.moneda); unitate.setText(existing.unitate); categorie.setText(existing.categorie)
        } else {
            moneda.setText("GBP"); unitate.setText("proiect"); categorie.setText("web-design")
        }
        val dlg = AlertDialog.Builder(this)
            .setTitle(if (existing == null) "New service" else "Edit service")
            .setView(v)
            .setPositiveButton("Save", null)
            .setNegativeButton("Cancel", null)
            .apply { if (existing != null) setNeutralButton("Delete", null) }
            .create()
        dlg.setOnShowListener {
            dlg.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val name = nume.text.toString().trim()
                val price = pret.text.toString().trim().toDoubleOrNull()
                if (name.isEmpty()) { nume.error = "Required"; return@setOnClickListener }
                if (price == null) { pret.error = "Enter a number"; return@setOnClickListener }
                save(existing, name, descriere.text.toString().trim(), price,
                    moneda.text.toString().trim().uppercase(), unitate.text.toString().trim(), categorie.text.toString().trim())
                dlg.dismiss()
            }
            dlg.getButton(AlertDialog.BUTTON_NEUTRAL)?.setOnClickListener {
                if (existing != null) confirmDelete(existing); dlg.dismiss()
            }
        }
        dlg.show()
    }

    private fun save(existing: Service?, nume: String, descriere: String, pret: Double, moneda: String, unitate: String, categorie: String) {
        val token = Prefs.token(this)
        io.execute {
            try {
                if (existing == null) Api.addService(token, nume, descriere, pret, moneda, unitate, categorie)
                else Api.updateService(token, existing.id, nume, descriere, pret, moneda, unitate, categorie)
                runOnUiThread { load() }
            } catch (e: Exception) { runOnUiThread { toast("Could not save.") } }
        }
    }

    private fun confirmDelete(s: Service) {
        AlertDialog.Builder(this)
            .setMessage("Delete “${s.nume}”?")
            .setPositiveButton("Delete") { _, _ ->
                val token = Prefs.token(this)
                io.execute {
                    try { Api.deleteService(token, s.id); runOnUiThread { load() } }
                    catch (e: Exception) { runOnUiThread { toast("Could not delete.") } }
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun toast(m: String) = android.widget.Toast.makeText(this, m, android.widget.Toast.LENGTH_SHORT).show()

    inner class SvcAdapter : RecyclerView.Adapter<SvcAdapter.VH>() {
        private val items = ArrayList<Service>()
        fun submit(list: List<Service>) { items.clear(); items.addAll(list); notifyDataSetChanged() }
        inner class VH(val v: ItemServiceBinding) : RecyclerView.ViewHolder(v.root)
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
            VH(ItemServiceBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        override fun getItemCount() = items.size
        override fun onBindViewHolder(h: VH, position: Int) {
            val s = items[position]
            h.v.nume.text = s.nume
            h.v.pret.text = Money.format(s.pret, s.moneda) + (if (s.unitate == "lună") "/mo" else "")
            h.v.descriere.text = s.descriere
            h.v.meta.text = listOf(s.categorie, s.unitate).filter { it.isNotBlank() }.joinToString(" · ")
            h.v.root.setOnClickListener { editDialog(s) }
        }
    }
}
