using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class PrincipalRepository : IPrincipalRepository
{
    private readonly ESeaDbContext _db;

    public PrincipalRepository(ESeaDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<Principal>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct)
    {
        var q = _db.Principals.AsQueryable();

        // Standard sorting rules logic
        var desc = (query?.Order ?? Order.desc) == Order.desc;
        q = (query?.Sort ?? Sort.created) switch
        {
            Sort.updated => desc ? q.OrderByDescending(p => p.UpdatedAt) : q.OrderBy(p => p.UpdatedAt),
            _ => desc ? q.OrderByDescending(p => p.CreatedAt) : q.OrderBy(p => p.CreatedAt)
        };

        int totalCount = await q.CountAsync(ct);

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<Principal>(items, page, pageSize, totalCount);
    }
}