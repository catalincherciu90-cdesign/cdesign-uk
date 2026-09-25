package uk.cdesigns.chat

import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

object Api {

    class ApiException(val code: Int, message: String) : Exception(message)

    private fun enc(s: String) = URLEncoder.encode(s, "UTF-8")

    private fun request(method: String, path: String, body: JSONObject?): String {
        val conn = URL(Prefs.BASE_URL + path).openConnection() as HttpURLConnection
        conn.requestMethod = method
        conn.connectTimeout = 15000
        conn.readTimeout = 20000
        conn.setRequestProperty("Accept", "application/json")
        if (body != null) {
            conn.doOutput = true
            conn.setRequestProperty("Content-Type", "application/json")
            conn.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
        }
        val code = conn.responseCode
        val stream = if (code in 200..299) conn.inputStream else (conn.errorStream ?: conn.inputStream)
        val text = stream.bufferedReader().use(BufferedReader::readText)
        conn.disconnect()
        if (code !in 200..299) throw ApiException(code, "HTTP $code")
        return text
    }

    /** Returns the session token, or throws. */
    fun login(username: String, password: String): String {
        val body = JSONObject().put("username", username).put("password", password)
        val res = JSONObject(request("POST", "/api/login", body))
        val token = res.optString("token", "")
        if (token.isEmpty()) throw ApiException(401, "No token returned")
        return token
    }

    fun listConversations(token: String): List<Conversation> {
        val res = request("GET", "/api/chat-logs?token=" + enc(token), null)
        val arr = JSONArray(res)
        val out = ArrayList<Conversation>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            val visitor = o.optJSONObject("visitor")
            out.add(
                Conversation(
                    id = o.optString("id"),
                    num = o.optInt("num"),
                    name = visitor?.optString("name") ?: "",
                    preview = o.optString("preview"),
                    updated = o.optString("updated"),
                    count = o.optInt("count"),
                    mode = o.optString("mode", "ai"),
                    ownerUnread = o.optInt("ownerUnread", 0),
                    geo = geoOf(o.optJSONObject("geo")),
                    ip = o.optString("ip")
                )
            )
        }
        return out
    }

    fun getConversation(token: String, id: String): ConversationDetail {
        val res = request("GET", "/api/chat-logs/" + enc(id) + "?token=" + enc(token), null)
        val o = JSONObject(res)
        val visitor = o.optJSONObject("visitor")
        val msgsArr = o.optJSONArray("messages") ?: JSONArray()
        val msgs = ArrayList<Message>()
        for (i in 0 until msgsArr.length()) {
            val m = msgsArr.optJSONObject(i) ?: continue
            msgs.add(Message(m.optString("role"), m.optString("content"), m.optString("by")))
        }
        return ConversationDetail(
            id = o.optString("id", id),
            num = o.optInt("num"),
            name = visitor?.optString("name") ?: "",
            contact = visitor?.optString("contact") ?: "",
            mode = o.optString("mode", "ai"),
            messages = msgs
        )
    }

    fun reply(token: String, cid: String, text: String) {
        val body = JSONObject().put("cid", cid).put("text", text)
        request("POST", "/api/chat/reply?token=" + enc(token), body)
    }

    fun markRead(token: String, cid: String) {
        val body = JSONObject().put("cid", cid)
        request("POST", "/api/chat/read?token=" + enc(token), body)
    }

    // ── Email ──────────────────────────────────────────────────
    fun sendMail(token: String, to: String, subject: String, message: String) {
        val body = JSONObject().put("to", to).put("subject", subject).put("message", message)
        request("POST", "/api/send-mail?token=" + enc(token), body)
    }

    fun listSentMail(token: String): List<SentMail> {
        val arr = JSONArray(request("GET", "/api/sent-mail?token=" + enc(token), null))
        val out = ArrayList<SentMail>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            out.add(SentMail(o.optString("id"), o.optString("to"), o.optString("subject"), o.optString("status"), o.optString("createdAt")))
        }
        return out
    }

    // ── CRM ────────────────────────────────────────────────────
    fun listCrm(token: String): List<CrmEntry> {
        val arr = JSONArray(request("GET", "/api/crm?token=" + enc(token), null))
        val out = ArrayList<CrmEntry>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            out.add(crmOf(o))
        }
        return out
    }

    fun addCrm(token: String, client: String, proiect: String, valoare: String, termen: String, status: String, note: String) {
        val body = JSONObject().put("client", client).put("proiect", proiect)
            .put("valoare", valoare).put("termen", termen).put("status", status).put("note", note)
        request("POST", "/api/crm?token=" + enc(token), body)
    }

    fun updateCrm(token: String, id: String, fields: JSONObject) {
        request("PUT", "/api/crm/" + enc(id) + "?token=" + enc(token), fields)
    }

    fun deleteCrm(token: String, id: String) {
        request("DELETE", "/api/crm/" + enc(id) + "?token=" + enc(token), null)
    }

    private fun crmOf(o: JSONObject) = CrmEntry(
        o.optString("id"), o.optString("client"), o.optString("proiect"),
        o.optString("valoare"), o.optString("termen"),
        o.optString("status", "oferta"), o.optString("note"), o.optString("createdAt")
    )

    // ── Messages & bookings (for notifications) ────────────────
    fun listMessages(token: String): List<MessageItem> {
        val arr = JSONArray(request("GET", "/api/messages?token=" + enc(token), null))
        val out = ArrayList<MessageItem>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            out.add(MessageItem(o.optString("id"), o.optString("name"), o.optString("phone"),
                o.optString("service"), o.optString("message"), o.optBoolean("read", false), o.optString("createdAt")))
        }
        return out
    }

    fun listBookings(token: String): List<Booking> {
        val arr = JSONArray(request("GET", "/api/bookings?token=" + enc(token), null))
        val out = ArrayList<Booking>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            out.add(Booking(o.optString("id"), o.optString("name"), o.optString("phone"),
                o.optString("service"), o.optString("date"), o.optString("time"),
                o.optString("status", "nou"), o.optString("createdAt")))
        }
        return out
    }

    // ── Services catalogue (edit) ──────────────────────────────
    fun addService(token: String, nume: String, descriere: String, pret: Double, moneda: String, unitate: String, categorie: String) {
        val body = JSONObject().put("nume", nume).put("descriere", descriere).put("pret", pret)
            .put("moneda", moneda).put("unitate", unitate).put("categorie", categorie)
        request("POST", "/api/servicii?token=" + enc(token), body)
    }

    fun updateService(token: String, id: String, nume: String, descriere: String, pret: Double, moneda: String, unitate: String, categorie: String) {
        val body = JSONObject().put("nume", nume).put("descriere", descriere).put("pret", pret)
            .put("moneda", moneda).put("unitate", unitate).put("categorie", categorie)
        request("PUT", "/api/servicii/" + enc(id) + "?token=" + enc(token), body)
    }

    fun deleteService(token: String, id: String) {
        request("DELETE", "/api/servicii/" + enc(id) + "?token=" + enc(token), null)
    }

    // ── Quotes (ofertare) ──────────────────────────────────────
    fun listServices(token: String): List<Service> {
        val arr = JSONArray(request("GET", "/api/servicii?token=" + enc(token), null))
        val out = ArrayList<Service>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            out.add(Service(o.optString("id"), o.optString("nume"), o.optString("descriere"),
                o.optDouble("pret", 0.0), o.optString("moneda", "GBP"), o.optString("unitate", "proiect"), o.optString("categorie", "altele")))
        }
        return out
    }

    fun listOffers(token: String): List<Offer> {
        val arr = JSONArray(request("GET", "/api/oferte?token=" + enc(token), null))
        val out = ArrayList<Offer>()
        for (i in 0 until arr.length()) {
            val o = arr.optJSONObject(i) ?: continue
            val svcs = o.optJSONArray("servicii") ?: JSONArray()
            var total = 0.0
            for (j in 0 until svcs.length()) total += svcs.optJSONObject(j)?.optDouble("pret", 0.0) ?: 0.0
            val client = o.optJSONObject("client")
            out.add(Offer(o.optString("id"), o.optString("numar"), client?.optString("name") ?: "",
                total, o.optString("moneda", "GBP"), o.optString("status", "trimisă"), o.optString("createdAt")))
        }
        // newest first
        return out.sortedByDescending { it.createdAt }
    }

    /** Create a quote; returns the new quote's id. */
    fun createOffer(token: String, name: String, email: String, phone: String,
                    services: List<Service>, moneda: String, valabilitate: String, note: String): String {
        val client = JSONObject().put("name", name).put("email", email).put("phone", phone)
        val svcArr = JSONArray()
        for (s in services) {
            svcArr.put(JSONObject().put("id", s.id).put("nume", s.nume).put("descriere", s.descriere)
                .put("pret", s.pret).put("moneda", s.moneda).put("unitate", s.unitate))
        }
        val body = JSONObject().put("client", client).put("servicii", svcArr)
            .put("moneda", moneda).put("valabilitate", valabilitate).put("note", note)
        val res = JSONObject(request("POST", "/api/oferte?token=" + enc(token), body))
        return res.optString("id")
    }

    private fun geoOf(g: JSONObject?): String {
        if (g == null) return ""
        val parts = listOf(g.optString("city"), g.optString("region"), g.optString("country"))
            .filter { it.isNotBlank() }
        return parts.joinToString(", ")
    }
}
