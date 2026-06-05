namespace Domain.Entities;

public class BlacklistedToken : Base
{
    public Guid Id { get; private set; }
    public string Token { get; private set; }
    public DateTime ExpiresAt { get; private set; }

    public static BlacklistedToken Create(string token, DateTime expiresAt)
    {
        return new BlacklistedToken
        {
            Id = Guid.NewGuid(),
            Token = token,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        };
    }
}
