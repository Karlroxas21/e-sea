using Domain.Entities;
using Domain.Ports;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ESeaDbContext _context;

    public RefreshTokenRepository(ESeaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(RefreshToken refreshToken, CancellationToken ct = default)
    {
        await _context.RefreshTokens.AddAsync(refreshToken, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default)
    {
        return await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token, ct);
    }

    public async Task RemoveAsync(RefreshToken refreshToken, CancellationToken ct = default)
    {
        _context.RefreshTokens.Remove(refreshToken);
        await _context.SaveChangesAsync(ct);
    }

    public async Task RemoveByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId)
            .ToListAsync(ct);

        _context.RefreshTokens.RemoveRange(tokens);
        await _context.SaveChangesAsync(ct);
    }
}