using Domain.Entities;

namespace Domain.Ports;

public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken refreshToken, CancellationToken ct = default);
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
    Task RemoveAsync(RefreshToken refreshToken, CancellationToken ct = default);
    Task RemoveByUserIdAsync(Guid userId, CancellationToken ct = default);
}