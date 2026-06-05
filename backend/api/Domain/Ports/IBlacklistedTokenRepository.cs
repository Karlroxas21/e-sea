namespace Domain.Ports;

public interface IBlacklistedTokenRepository
{
    Task AddAsync(string token, DateTime expiresAt, CancellationToken ct);
    Task<bool> IsBlacklistedAsync(string token, CancellationToken ct);
}
