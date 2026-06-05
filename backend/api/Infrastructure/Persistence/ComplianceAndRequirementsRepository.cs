using System.Security.Cryptography;
using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ComplianceAndRequirementsRepository : IComplianceAndRequirementsRepository
{
    private readonly ESeaDbContext _db;
    private readonly IUserContext _userContext;

    public ComplianceAndRequirementsRepository(ESeaDbContext db, IUserContext userContext)
    {
        _db = db;
        _userContext = userContext;
    }

    public async Task<PagedResult<ComplianceAndRequirements>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default)
    {
        var userId = _userContext.UserId;

        var q = _db.ComplianceAndRequirements
            .Where(c => c.DeletedAt == null && c.UserId == userId);

        q = ApplySort(q, query.Sort, query.Order);

        var Total = await q.CountAsync(ct);
        var Items = await q
            .Skip((Page - 1) * PageSize)
            .Take(PageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedResult<ComplianceAndRequirements>(Items, Page, PageSize, Total);

    }

    private static IQueryable<ComplianceAndRequirements> ApplySort(IQueryable<ComplianceAndRequirements> query, Sort? sort, Order? order)
    {
        var desc = (order ?? Order.desc) == Order.desc;

        return (sort ?? Sort.created) switch
        {
            Sort.updated => desc ? query.OrderByDescending(c => c.UpdatedAt) : query.OrderBy(c => c.UpdatedAt),
            _ => desc ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
        };
    }

    public async Task<ComplianceScoreResult> GetComplianceScore(Guid UserId, CancellationToken ct = default)
    {
        var records = await _db.ComplianceAndRequirements
            .Where(c => c.DeletedAt == null && c.UserId == UserId)
            .ToListAsync(ct);

        if (records.Count == 0)
            return new ComplianceScoreResult(100, 0, 0);

        var validCount = records.Count(c => c.Status == "Valid" || c.Status == "Signed");
        var missingCount = records.Count(c => c.Status == "Missing");
        var expiredExpiringSoonPendingCount = records.Count(c =>
            c.Status == "Expired" ||
            c.Status == "Expiring Soon" ||
            c.Status == "Pending" ||
            c.Status == "Pending Review");

        var score = (validCount * 100) / records.Count;

        return new ComplianceScoreResult(score, missingCount, expiredExpiringSoonPendingCount);
    }
}
