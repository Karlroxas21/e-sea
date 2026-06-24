namespace Service.Dtos;

public record SendMessageHubRequest(string Content, Guid ReceiverId);
public record SendMessageRequest(Guid RecipientId, string Content);
public record ChatMessage(string Id, string SenderId, string ReceiverId, string Content, DateTime CreatedAt);