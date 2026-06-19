using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class PositionRepository : IPositionRepository
{
    private readonly ESeaDbContext _context;

    public PositionRepository(ESeaDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<Positions>> GetAllAsync(int Page, int PageSize, BaseQuery? query, CancellationToken ct)
    {
        var q = _context.Positions.AsQueryable();

        var totalCount = await q.CountAsync(ct);
        var items = await q
            .OrderBy(p => p.Title)
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<Positions>(items, Page, PageSize, totalCount);
    }
}