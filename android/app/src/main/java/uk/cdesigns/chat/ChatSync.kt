package uk.cdesigns.chat

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat

object ChatSync {
    const val CH_SERVICE = "service"
    const val CH_MESSAGES = "messages"
    const val FG_ID = 1

    fun createChannels(ctx: Context) {
        val nm = ctx.getSystemService(NotificationManager::class.java)
        val svc = NotificationChannel(CH_SERVICE, "Background sync", NotificationManager.IMPORTANCE_MIN).apply {
            description = "Keeps the app checking for new chat messages."
            setShowBadge(false)
        }
        val msg = NotificationChannel(CH_MESSAGES, "New chat messages", NotificationManager.IMPORTANCE_HIGH).apply {
            description = "Alerts when a website visitor sends a message."
            enableVibration(true)
        }
        nm.createNotificationChannel(svc)
        nm.createNotificationChannel(msg)
    }

    fun startService(ctx: Context) {
        createChannels(ctx)
        ContextCompat.startForegroundService(ctx, Intent(ctx, PollService::class.java))
    }

    fun stopService(ctx: Context) {
        ctx.stopService(Intent(ctx, PollService::class.java))
    }

    fun foregroundNotification(ctx: Context): android.app.Notification {
        val open = PendingIntent.getActivity(
            ctx, 0, Intent(ctx, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        return NotificationCompat.Builder(ctx, CH_SERVICE)
            .setContentTitle("C Design chat active")
            .setContentText("Watching for new messages from your website.")
            .setSmallIcon(R.drawable.ic_notify)
            .setOngoing(true)
            .setContentIntent(open)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .build()
    }

    fun notifyNewMessage(ctx: Context, id: String, num: Int, name: String, preview: String) {
        val intent = Intent(ctx, MainActivity::class.java)
            .putExtra("cid", id)
            .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        val pi = PendingIntent.getActivity(
            ctx, id.hashCode(), intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val who = if (name.isNotBlank()) name else "Visitor #" + num.toString().padStart(4, '0')
        val n = NotificationCompat.Builder(ctx, CH_MESSAGES)
            .setContentTitle(who)
            .setContentText(if (preview.isNotBlank()) preview else "New message")
            .setStyle(NotificationCompat.BigTextStyle().bigText(if (preview.isNotBlank()) preview else "New message"))
            .setSmallIcon(R.drawable.ic_notify)
            .setAutoCancel(true)
            .setContentIntent(pi)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()
        ctx.getSystemService(NotificationManager::class.java).notify(id.hashCode(), n)
    }

    fun clearNotification(ctx: Context, id: String) {
        ctx.getSystemService(NotificationManager::class.java).cancel(id.hashCode())
    }
}
