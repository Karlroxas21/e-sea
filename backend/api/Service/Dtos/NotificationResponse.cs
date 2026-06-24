namespace Service.Dtos;

public record NotificationDto(
    Guid SenderId,
    string Content,
    string Type,
    DateTime CreatedAt
);

public record BroadcastRequest(string Content);