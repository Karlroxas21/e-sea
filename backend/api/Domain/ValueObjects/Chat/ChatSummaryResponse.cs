namespace Domain.ValueObjects.Chat;

public record ChatSummaryResponse(
    Guid OtherUserId, 
    string OtherUserName, 
    string LastMessage, 
    DateTime SentAt
);