using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly ESeaDbContext _db;
    private readonly IUserContext _userContext;
    public AssignmentRepository(ESeaDbContext db, IUserContext userContext)
    {
        _db = db;
        _userContext = userContext;
    }
    public async Task<PagedAssignmentResult<Assignments>> GetAllAsync(int Page, int PageSize, Status? status, BaseQuery? query, CancellationToken ct)
    {
        var userId = _userContext.UserId;

        var statusStr = status switch
        {
            Status.CurrentlyOnboard => "currently-onboard",
            Status.Upcoming => "upcoming",
            Status.Completed => "completed",
            _ => "completed"
        };

        var baseQuery = _db.Assignments
            .Where(a => a.UserId == userId && a.DeletedAt == null);

        // Get counts for the summary
        var counts = await baseQuery
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        int totalActive = counts.FirstOrDefault(c => c.Status == "currently-onboard")?.Count ?? 0;
        int totalUpcoming = counts.FirstOrDefault(c => c.Status == "upcoming")?.Count ?? 0;
        int totalHistory = counts.FirstOrDefault(c => c.Status == "completed")?.Count ?? 0;
        int all = totalActive + totalUpcoming + totalHistory;

        var q = baseQuery.Where(a => a.Status == statusStr);

        q = ApplySort(q, query?.Sort, query?.Order);

        var totalCount = await q.CountAsync(ct);

        var items = await q
            .Include(a => a.Vessel)
                .ThenInclude(v => v.VesselRequirements)
                    .ThenInclude(vr => vr.DocumentType)
            .Include(a => a.User)
                .ThenInclude(u => u.ComplianceAndRequirements)
            .Include(a => a.Position)
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedAssignmentResult<Assignments>(
            items,
            Page,
            PageSize,
            totalCount,
            totalActive,
            totalUpcoming,
            totalHistory,
            all
        );
    }
    public async Task<List<Assignments>> GetUpcomingAssignmentsAsync(Guid userId, CancellationToken ct)
    {
        return await _db.Assignments
            .Where(a => a.UserId == userId && (a.Status == "upcoming" || a.Status == "currently-onboard"))
            .Include(a => a.Vessel)
                .ThenInclude(v => v.VesselRequirements)
                    .ThenInclude(vr => vr.DocumentType)
            .Include(a => a.User)
                .ThenInclude(u => u.ComplianceAndRequirements)
            .ToListAsync(ct);
    }

    public async Task UpdateAsync(Assignments assignment, CancellationToken ct)
    {
        _db.Assignments.Update(assignment);
        await _db.SaveChangesAsync(ct);
    }

    private static IQueryable<Assignments> ApplySort(IQueryable<Assignments> query, Sort? sort, Order? order)
    {
        var desc = (order ?? Order.desc) == Order.desc;

        return (sort ?? Sort.created) switch
        {
            Sort.updated => desc ? query.OrderByDescending(c => c.UpdatedAt) : query.OrderBy(c => c.UpdatedAt),
            _ => desc ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
        };
    }

    public async Task<int> GetSeaTimeAcrossCompletedAssignments(CancellationToken ct  )
    {
        int totalDays = await _db.Assignments
            .Where(a => a.UserId == _userContext.UserId)
            .SumAsync(a => EF.Functions.DateDiffDay(a.SignOnDate, a.SignOffDate), ct);

        return totalDays;
    }

     public async Task AddAsync(Assignments assignment, CancellationToken ct)
    {
        await _db.Assignments.AddAsync(assignment, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<Assignments?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _db.Assignments
            .Include(a => a.Vessel)
                .ThenInclude(v => v.VesselRequirements)
                    .ThenInclude(vr => vr.DocumentType)
            .Include(a => a.User)
                .ThenInclude(u => u.ComplianceAndRequirements)
            .Include(a => a.Position)
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }
}