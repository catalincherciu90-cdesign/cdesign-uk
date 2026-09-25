package uk.cdesigns.chat

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

// Restart the background sync after the phone reboots, so notifications keep working.
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED && Prefs.token(context).isNotEmpty()) {
            ChatSync.startService(context)
        }
    }
}
