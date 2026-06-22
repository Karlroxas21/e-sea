namespace Domain.Entities;

public class ChatMessage : Base
{
    public Guid SenderId { get; private set; }
    public Guid RecipientId { get; private set; } 
    public string Content { get; private set; }
    public DateTime SentAt { get; private set; }

    private ChatMessage(Guid senderId, Guid recipientId, string content)
    {
        SenderId = senderId;
        RecipientId = recipientId;
        Content = content;
        SentAt = DateTime.UtcNow;
    }

    public static ChatMessage Create(Guid senderId, Guid recipientId, string content) 
        => new(senderId, recipientId, content);
}