package uk.cdesigns.chat

import android.content.Context

object Prefs {
    private const val FILE = "cdchat"
    const val BASE_URL = "https://c-designs.uk"

    private fun sp(ctx: Context) = ctx.getSharedPreferences(FILE, Context.MODE_PRIVATE)

    fun token(ctx: Context): String = sp(ctx).getString("token", "") ?: ""
    fun setToken(ctx: Context, t: String) = sp(ctx).edit().putString("token", t).apply()
    fun clear(ctx: Context) = sp(ctx).edit().clear().apply()

    // Highest ownerUnread we've already notified about, per conversation id,
    // so we only raise a notification when something new actually arrives.
    fun notifiedCount(ctx: Context, id: String): Int = sp(ctx).getInt("nc_$id", 0)
    fun setNotifiedCount(ctx: Context, id: String, n: Int) = sp(ctx).edit().putInt("nc_$id", n).apply()

    // Ids already seen/notified for messages & bookings (so we notify once per new item).
    fun seenIds(ctx: Context, kind: String): MutableSet<String> =
        HashSet(sp(ctx).getStringSet("seen_$kind", emptySet()) ?: emptySet())
    fun setSeenIds(ctx: Context, kind: String, ids: Set<String>) =
        sp(ctx).edit().putStringSet("seen_$kind", ids).apply()
    fun isSeeded(ctx: Context, kind: String): Boolean = sp(ctx).getBoolean("seeded_$kind", false)
    fun setSeeded(ctx: Context, kind: String) = sp(ctx).edit().putBoolean("seeded_$kind", true).apply()
}
