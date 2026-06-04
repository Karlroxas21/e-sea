
using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class NewsRepository : INewsRepository
{
    private readonly ESeaDbContext _db;

    public NewsRepository(ESeaDbContext db) => _db = db;
    public async Task<PagedResult<News>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default)
    {
        var q = _db.News.Where(c => c.DeletedAt == null);

        q = ApplySort(q, query.Sort, query.Order);

        var Total = await q.CountAsync(ct);
        var Items = await q
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<News>(Items, Page, PageSize, Total);

    }

    private static IQueryable<News> ApplySort(IQueryable<News> query, Sort? sort, Order? order)
    {
        var desc = (order ?? Order.desc) == Order.desc;

        return (sort ?? Sort.created) switch
        {
            Sort.updated => desc ? query.OrderByDescending(c => c.UpdatedAt) : query.OrderBy(c => c.UpdatedAt),
            _ => desc ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
        };
    }
}
