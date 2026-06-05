using Domain.Entities;
using Domain.Ports;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class BlacklistedTokenRepository : IBlacklistedTokenRepository
{
    private readonly ESeaDbContext _context;

    public BlacklistedTokenRepository(ESeaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(string token, DateTime expiresAt, CancellationToken ct)
    {
        var blacklistedToken = BlacklistedToken.Create(token, expiresAt);
        await _context.BlacklistedTokens.AddAsync(blacklistedToken, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> IsBlacklistedAsync(string token, CancellationToken ct)
    {
        return await _context.BlacklistedTokens.AnyAsync(t => t.Token == token, ct);
    }
}
