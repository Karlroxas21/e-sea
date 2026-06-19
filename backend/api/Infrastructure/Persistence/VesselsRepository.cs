using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class VesselRepository : IVesselRepository
{
    private readonly ESeaDbContext _db;

    public VesselRepository(ESeaDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<Vessles>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct)
    {
        var q = _db.Vessels.AsQueryable(); 

        var desc = (query?.Order ?? Order.desc) == Order.desc;
        q = (query?.Sort ?? Sort.created) switch
        {
            Sort.updated => desc ? q.OrderByDescending(v => v.UpdatedAt) : q.OrderBy(v => v.UpdatedAt),
            _ => desc ? q.OrderByDescending(v => v.CreatedAt) : q.OrderBy(v => v.CreatedAt)
        };

        int totalCount = await q.CountAsync(ct);

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<Vessles>(items, page, pageSize, totalCount);
    }
}