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

    private fun geoOf(g: JSONObject?): String {
        if (g == null) return ""
        val parts = listOf(g.optString("city"), g.optString("region"), g.optString("country"))
            .filter { it.isNotBlank() }
        return parts.joinToString(", ")
    }
}
