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
        try {
            val list = Api.listConversations(token)
            for (c in list) {
                val alreadyNotified = Prefs.notifiedCount(this, c.id)
                if (c.ownerUnread > 0 && c.ownerUnread > alreadyNotified) {
                    ChatSync.notifyNewMessage(this, c.id, c.num, c.name, c.preview)
                    Prefs.setNotifiedCount(this, c.id, c.ownerUnread)
                } else if (c.ownerUnread == 0 && alreadyNotified != 0) {
                    // Owner has caught up — reset so future messages notify again.
                    Prefs.setNotifiedCount(this, c.id, 0)
                }
            }
        } catch (e: Api.ApiException) {
            if (e.code == 401) stopSelf()
        } catch (e: Exception) {
            // transient network error — try again next tick
        }
    }

    override fun onDestroy() {
        scheduler?.shutdownNow()
        scheduler = null
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
