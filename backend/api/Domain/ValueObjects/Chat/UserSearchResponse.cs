namespace Domain.ValueObjects.Chat;

public record UserSearchResponse(
    Guid Id,
    string FullName,
    string Email
);
