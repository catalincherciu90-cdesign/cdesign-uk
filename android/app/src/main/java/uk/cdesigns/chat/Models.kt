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
