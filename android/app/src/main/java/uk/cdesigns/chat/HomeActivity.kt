package uk.cdesigns.chat

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import uk.cdesigns.chat.databinding.ActivityHomeBinding
import java.util.concurrent.Executors

class HomeActivity : AppCompatActivity() {

    private lateinit var b: ActivityHomeBinding
    private val io = Executors.newSingleThreadExecutor()

    private val notifPerm = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Prefs.token(this).isEmpty()) { goToLogin(); return }

        b = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(b.root)

        b.cardChat.setOnClickListener { startActivity(Intent(this, MainActivity::class.java)) }
        b.cardCrm.setOnClickListener { startActivity(Intent(this, CrmActivity::class.java)) }
        b.cardQuotes.setOnClickListener { startActivity(Intent(this, QuotesActivity::class.java)) }
        b.cardEmail.setOnClickListener { startActivity(Intent(this, EmailActivity::class.java)) }
        b.cardServices.setOnClickListener { startActivity(Intent(this, ServicesActivity::class.java)) }
        b.logout.setOnClickListener { logout() }

        askNotifPermission()
        ChatSync.startService(this)
        ensureBackgroundAllowed()

        // A notification tap can route straight to a conversation.
        val cid = intent?.getStringExtra("cid")
        if (!cid.isNullOrEmpty()) {
            startActivity(Intent(this, MainActivity::class.java))
            startActivity(Intent(this, ChatActivity::class.java).putExtra("cid", cid))
        }
    }

    override fun onResume() {
        super.onResume()
        refreshChatBadge()
    }

    private fun refreshChatBadge() {
        val token = Prefs.token(this)
        if (token.isEmpty()) return
        io.execute {
            try {
                val unread = Api.listConversations(token).sumOf { it.ownerUnread }
                runOnUiThread {
                    if (unread > 0) { b.chatBadge.text = "● $unread"; b.chatBadge.visibility = View.VISIBLE }
                    else b.chatBadge.visibility = View.GONE
                }
            } catch (e: Exception) { /* ignore */ }
        }
    }

    // Ask (once) to be excluded from battery optimisation so the app keeps
    // running and notifying even after the window is closed.
    private fun ensureBackgroundAllowed() {
        try {
            val pm = getSystemService(PowerManager::class.java)
            if (pm != null && !pm.isIgnoringBatteryOptimizations(packageName) && !Prefs.askedBattery(this)) {
                Prefs.setAskedBattery(this)
                AlertDialog.Builder(this)
                    .setTitle("Keep chat running")
                    .setMessage("To receive messages and bookings even when the app is closed, allow it to run in the background (ignore battery optimisation).")
                    .setPositiveButton("Allow") { _, _ -> openBatterySettings() }
                    .setNegativeButton("Later", null)
                    .show()
            }
        } catch (e: Exception) { /* ignore */ }
    }

    private fun openBatterySettings() {
        try {
            startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$packageName")))
        } catch (e: Exception) {
            try { startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)) } catch (e2: Exception) {}
        }
    }

    private fun askNotifPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) notifPerm.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    private fun logout() {
        Prefs.clear(this)
        ChatSync.stopService(this)
        goToLogin()
    }

    private fun goToLogin() {
        startActivity(Intent(this, LoginActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP))
        finish()
    }
}
