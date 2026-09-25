package uk.cdesigns.chat

object Money {
    fun symbol(currency: String): String = when (currency) {
        "GBP" -> "£"
        "EUR" -> "€"
        "RON" -> "RON "
        else -> ""
    }

    fun format(amount: Double, currency: String): String {
        val n = if (amount == amount.toLong().toDouble()) amount.toLong().toString()
        else String.format("%.2f", amount)
        return symbol(currency) + n
    }
}
