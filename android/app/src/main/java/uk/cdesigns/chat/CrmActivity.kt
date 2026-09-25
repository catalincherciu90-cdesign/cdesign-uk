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
import org.json.JSONObject
import uk.cdesigns.chat.databinding.ActivityCrmBinding
import uk.cdesigns.chat.databinding.ItemCrmBinding
import java.util.concurrent.Executors

class CrmActivity : AppCompatActivity() {

    private lateinit var b: ActivityCrmBinding
    private val io = Executors.newSingleThreadExecutor()
    private val adapter = CrmAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { finish(); return }
        b = ActivityCrmBinding.inflate(layoutInflater)
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
                val list = Api.listCrm(token)
                runOnUiThread {
                    adapter.submit(list)
                    b.empty.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) { /* ignore */ }
        }
    }

    private fun editDialog(existing: CrmEntry?) {
        val v = layoutInflater.inflate(R.layout.dialog_crm, null)
        val client = v.findViewById<EditText>(R.id.client)
        val proiect = v.findViewById<EditText>(R.id.proiect)
        val valoare = v.findViewById<EditText>(R.id.valoare)
        val termen = v.findViewById<EditText>(R.id.termen)
        val status = v.findViewById<EditText>(R.id.status)
        val note = v.findViewById<EditText>(R.id.note)
        if (existing != null) {
            client.setText(existing.client); proiect.setText(existing.proiect)
            valoare.setText(existing.valoare); termen.setText(existing.termen)
            status.setText(existing.status); note.setText(existing.note)
        } else {
            status.setText("lead")
        }
        val dlg = AlertDialog.Builder(this)
            .setTitle(if (existing == null) "New CRM entry" else "Edit entry")
            .setView(v)
            .setPositiveButton("Save", null)
            .setNegativeButton("Cancel", null)
            .apply { if (existing != null) setNeutralButton("Delete", null) }
            .create()
        dlg.setOnShowListener {
            dlg.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val name = client.text.toString().trim()
                if (name.isEmpty()) { client.error = "Required"; return@setOnClickListener }
                save(existing, name, proiect.text.toString().trim(), valoare.text.toString().trim(),
                    termen.text.toString().trim(), status.text.toString().trim(), note.text.toString().trim())
                dlg.dismiss()
            }
            dlg.getButton(AlertDialog.BUTTON_NEUTRAL)?.setOnClickListener {
                if (existing != null) confirmDelete(existing); dlg.dismiss()
            }
        }
        dlg.show()
    }

    private fun save(existing: CrmEntry?, client: String, proiect: String, valoare: String, termen: String, status: String, note: String) {
        val token = Prefs.token(this)
        io.execute {
            try {
                if (existing == null) {
                    Api.addCrm(token, client, proiect, valoare, termen, status, note)
                } else {
                    val f = JSONObject().put("client", client).put("proiect", proiect)
                        .put("valoare", valoare).put("termen", termen).put("status", status).put("note", note)
                    Api.updateCrm(token, existing.id, f)
                }
                runOnUiThread { load() }
            } catch (e: Exception) {
                runOnUiThread { toast("Could not save.") }
            }
        }
    }

    private fun confirmDelete(entry: CrmEntry) {
        AlertDialog.Builder(this)
            .setMessage("Delete this CRM entry?")
            .setPositiveButton("Delete") { _, _ ->
                val token = Prefs.token(this)
                io.execute {
                    try { Api.deleteCrm(token, entry.id); runOnUiThread { load() } }
                    catch (e: Exception) { runOnUiThread { toast("Could not delete.") } }
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun toast(m: String) = android.widget.Toast.makeText(this, m, android.widget.Toast.LENGTH_SHORT).show()

    inner class CrmAdapter : RecyclerView.Adapter<CrmAdapter.VH>() {
        private val items = ArrayList<CrmEntry>()
        fun submit(list: List<CrmEntry>) { items.clear(); items.addAll(list); notifyDataSetChanged() }
        inner class VH(val v: ItemCrmBinding) : RecyclerView.ViewHolder(v.root)
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
            VH(ItemCrmBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        override fun getItemCount() = items.size
        override fun onBindViewHolder(h: VH, position: Int) {
            val c = items[position]
            h.v.client.text = c.client
            h.v.status.text = if (c.status.isNotBlank()) c.status else "—"
            h.v.proiect.text = if (c.proiect.isNotBlank()) c.proiect else "—"
            val bits = ArrayList<String>()
            if (c.valoare.isNotBlank()) bits.add(c.valoare)
            if (c.termen.isNotBlank()) bits.add("⏱ " + c.termen)
            h.v.meta.text = bits.joinToString(" · ")
            h.v.root.setOnClickListener { editDialog(c) }
        }
    }
}
