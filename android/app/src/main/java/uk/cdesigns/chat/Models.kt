package uk.cdesigns.chat

data class Conversation(
    val id: String,
    val num: Int,
    val name: String,
    val preview: String,
    val updated: String,
    val count: Int,
    val mode: String,
    val ownerUnread: Int,
    val geo: String,
    val ip: String
)

data class Message(
    val role: String,     // "user" (visitor), "owner" (you), "assistant" (old AI)
    val content: String,
    val by: String
)

data class ConversationDetail(
    val id: String,
    val num: Int,
    val name: String,
    val contact: String,
    val mode: String,
    val messages: List<Message>
)

data class SentMail(
    val id: String,
    val to: String,
    val subject: String,
    val status: String,
    val createdAt: String
)

data class CrmEntry(
    val id: String,
    val client: String,
    val proiect: String,
    val valoare: String,
    val termen: String,
    val status: String,
    val note: String,
    val createdAt: String
)

data class Service(
    val id: String,
    val nume: String,
    val descriere: String,
    val pret: Double,
    val moneda: String,
    val unitate: String,
    val categorie: String
)

data class MessageItem(
    val id: String,
    val name: String,
    val phone: String,
    val service: String,
    val message: String,
    val read: Boolean,
    val createdAt: String
)

data class Booking(
    val id: String,
    val name: String,
    val phone: String,
    val service: String,
    val date: String,
    val time: String,
    val status: String,
    val createdAt: String
)

data class Offer(
    val id: String,
    val numar: String,
    val clientName: String,
    val total: Double,
    val moneda: String,
    val status: String,
    val createdAt: String
)
