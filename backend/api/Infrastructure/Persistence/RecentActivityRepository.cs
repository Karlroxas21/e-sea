
using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class RecentActivityRepository : IRecentActivityRepository
{
    private readonly ESeaDbContext _db;

    public RecentActivityRepository(ESeaDbContext db) => _db = db;
    public async Task<PagedResult<RecentActivityFeed>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default)
    {
        var q = _db.RecentActivityFeeds.Where(c => c.DeletedAt == null);

        q = ApplySort(q, query.Sort, query.Order);

        var Total = await q.CountAsync(ct);
        var Items = await q
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<RecentActivityFeed>(Items, Page, PageSize, Total);

    }

    private static IQueryable<RecentActivityFeed> ApplySort(IQueryable<RecentActivityFeed> query, Sort? sort, Order? order)
    {
        var desc = (order ?? Order.desc) == Order.desc;

        return (sort ?? Sort.created) switch
        {
            Sort.updated => desc ? query.OrderByDescending(c => c.UpdatedAt) : query.OrderBy(c => c.UpdatedAt),
            _ => desc ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
        };
    }
}
