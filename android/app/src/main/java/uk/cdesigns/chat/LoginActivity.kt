package uk.cdesigns.chat

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import uk.cdesigns.chat.databinding.ActivityLoginBinding
import java.util.concurrent.Executors

class LoginActivity : AppCompatActivity() {

    private lateinit var b: ActivityLoginBinding
    private val io = Executors.newSingleThreadExecutor()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Already signed in? Go straight to the list.
        if (Prefs.token(this).isNotEmpty()) {
            goToMain()
            return
        }

        b = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(b.root)

        b.loginBtn.setOnClickListener { doLogin() }
    }

    private fun doLogin() {
        val user = b.username.text.toString().trim()
        val pass = b.password.text.toString()
        if (user.isEmpty() || pass.isEmpty()) {
            showError("Please enter your username and password.")
            return
        }
        setLoading(true)
        io.execute {
            try {
                val token = Api.login(user, pass)
                Prefs.setToken(this, token)
                runOnUiThread {
                    setLoading(false)
                    goToMain()
                }
            } catch (e: Api.ApiException) {
                runOnUiThread {
                    setLoading(false)
                    showError(if (e.code == 401) "Wrong username or password." else "Sign-in failed (${e.code}).")
                }
            } catch (e: Exception) {
                runOnUiThread {
                    setLoading(false)
                    showError("Network error. Check your connection and try again.")
                }
            }
        }
    }

    private fun goToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }

    private fun setLoading(on: Boolean) {
        b.progress.visibility = if (on) android.view.View.VISIBLE else android.view.View.GONE
        b.loginBtn.isEnabled = !on
    }

    private fun showError(msg: String) {
        b.error.text = msg
        b.error.visibility = android.view.View.VISIBLE
    }
}
