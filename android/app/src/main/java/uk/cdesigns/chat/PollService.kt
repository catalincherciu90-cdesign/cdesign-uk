package uk.cdesigns.chat

import android.app.Service
import android.content.Intent
import android.os.IBinder
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class PollService : Service() {

    private var scheduler: ScheduledExecutorService? = null

    override fun onCreate() {
        super.onCreate()
        startForeground(ChatSync.FG_ID, ChatSync.foregroundNotification(this))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (scheduler == null) {
            scheduler = Executors.newSingleThreadScheduledExecutor().also {
                it.scheduleWithFixedDelay({ poll() }, 2, 20, TimeUnit.SECONDS)
            }
        }
        return START_STICKY
    }

    private fun poll() {
        val token = Prefs.token(this)
        if (token.isEmpty()) { stopSelf(); return }
        // 1) Live chat
        try {
            val list = Api.listConversations(token)
            for (c in list) {
                val alreadyNotified = Prefs.notifiedCount(this, c.id)
                if (c.ownerUnread > 0 && c.ownerUnread > alreadyNotified) {
                    ChatSync.notifyNewMessage(this, c.id, c.num, c.name, c.preview)
                    Prefs.setNotifiedCount(this, c.id, c.ownerUnread)
                } else if (c.ownerUnread == 0 && alreadyNotified != 0) {
                    Prefs.setNotifiedCount(this, c.id, 0)
                }
            }
        } catch (e: Api.ApiException) {
            if (e.code == 401) { stopSelf(); return }
        } catch (e: Exception) { /* transient */ }

        // 2) New contact messages
        try {
            val msgs = Api.listMessages(token)
            val seen = Prefs.seenIds(this, "msg")
            if (!Prefs.isSeeded(this, "msg")) {
                Prefs.setSeenIds(this, "msg", msgs.map { it.id }.toSet()); Prefs.setSeeded(this, "msg")
            } else {
                for (m in msgs) {
                    if (!seen.contains(m.id)) {
                        val text = if (m.message.isNotBlank()) m.message else (m.service.ifBlank { "New enquiry" })
                        ChatSync.notifyGeneric(this, ("msg_" + m.id).hashCode(), "New message · " + m.name, text)
                        seen.add(m.id)
                    }
                }
                Prefs.setSeenIds(this, "msg", seen)
            }
        } catch (e: Exception) { /* messages perm may be missing, or transient */ }

        // 3) New bookings
        try {
            val bookings = Api.listBookings(token)
            val seen = Prefs.seenIds(this, "booking")
            if (!Prefs.isSeeded(this, "booking")) {
                Prefs.setSeenIds(this, "booking", bookings.map { it.id }.toSet()); Prefs.setSeeded(this, "booking")
            } else {
                for (bk in bookings) {
                    if (!seen.contains(bk.id)) {
                        val text = listOf(bk.service, bk.date, bk.time).filter { it.isNotBlank() }.joinToString(" · ")
                        ChatSync.notifyGeneric(this, ("bk_" + bk.id).hashCode(), "New booking · " + bk.name, text.ifBlank { "New booking" })
                        seen.add(bk.id)
                    }
                }
                Prefs.setSeenIds(this, "booking", seen)
            }
        } catch (e: Exception) { /* bookings perm may be missing, or transient */ }
    }

    override fun onDestroy() {
        scheduler?.shutdownNow()
        scheduler = null
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
