
using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class TrainingRepository : ITrainingRepository
{
    private readonly ESeaDbContext _db;
    private readonly IUserContext _userContext;

    public TrainingRepository(ESeaDbContext db, IUserContext userContext)
    {
        _db = db;
        _userContext = userContext;
    }

    public async Task<PagedResult<Trainings>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default)
    {
        var userId = _userContext.UserId;

        var q = _db.Trainings
            .Where(c => c.DeletedAt == null && c.UserId == userId);

        q = ApplySort(q, query.Sort, query.Order);

        var Total = await q.CountAsync(ct);
        var Items = await q
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<Trainings>(Items, Page, PageSize, Total);

    }

    private static IQueryable<Trainings> ApplySort(IQueryable<Trainings> query, Sort? sort, Order? order)
    {
        var desc = (order ?? Order.desc) == Order.desc;

        return (sort ?? Sort.created) switch
        {
            Sort.updated => desc ? query.OrderByDescending(c => c.UpdatedAt) : query.OrderBy(c => c.UpdatedAt),
            _ => desc ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
        };
    }

    public async Task<(int Completed, int Pending, int Scheduled)> GetTrainingStats(Guid UserId, CancellationToken ct = default)
    {
        var stats = await _db.Trainings
            .Where(t => t.DeletedAt == null && t.UserId == UserId)
            .GroupBy(t => t.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        return (
            stats.FirstOrDefault(s => s.Status == "Completed")?.Count ?? 0,
            stats.FirstOrDefault(s => s.Status == "Pending")?.Count ?? 0,
            stats.FirstOrDefault(s => s.Status == "Scheduled")?.Count ?? 0
        );
    }
}
