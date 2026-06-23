namespace Service.Dtos;

public record SendMessageHubRequest(string Content, Guid ReceiverId);
public record ChatMessage(string Id, string SenderId, string ReceiverId, string Content, DateTime CreatedAt);