namespace Service.Dtos;

public record NotificationDto(
    Guid SenderId,
    List<Guid> RecipientIds,
    string Content,
    string Type,
    DateTime CreatedAt
);

public record BroadcastRequest(List<Guid> RecipientIds, string Content);