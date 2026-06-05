using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Infrastructure.Persistence;
using Tests.Helpers;
using Xunit;

namespace Tests.Repositories;

/// <summary>
/// Covers the IDOR fix (commit 42efddd): the repo must scope rows to the
/// authenticated user from IUserContext, plus soft-delete, paging and sorting.
/// </summary>
public class ComplianceAndRequirementsRepositoryTests
{
    private static readonly BaseQuery DefaultQuery = new();

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyCurrentUsersRecords()
    {
        var userA = Guid.NewGuid();
        var userB = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.ComplianceAndRequirements.AddRange(
            TestEntityFactory.Compliance(userA, documentName: "A-doc-1"),
            TestEntityFactory.Compliance(userA, documentName: "A-doc-2"),
            TestEntityFactory.Compliance(userB, documentName: "B-doc-1"));
        await db.SaveChangesAsync();

        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userA));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Equal(2, result.TotalCount);
        Assert.All(result.Items, c => Assert.Equal(userA, c.UserId));
    }

    [Fact]
    public async Task GetAllAsync_DoesNotLeakOtherUsersRecords()
    {
        var attacker = Guid.NewGuid();
        var victim = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.ComplianceAndRequirements.Add(TestEntityFactory.Compliance(victim, documentName: "secret"));
        await db.SaveChangesAsync();

        // Attacker authenticated, but victim owns the only row.
        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(attacker));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_ExcludesSoftDeletedRecords()
    {
        var userId = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.ComplianceAndRequirements.AddRange(
            TestEntityFactory.Compliance(userId, documentName: "live"),
            TestEntityFactory.Compliance(userId, documentName: "deleted", deletedAt: DateTime.UtcNow));
        await db.SaveChangesAsync();

        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userId));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        var item = Assert.Single(result.Items);
        Assert.Equal("live", item.DocumentName);
    }

    [Fact]
    public async Task GetAllAsync_AppliesPaging()
    {
        var userId = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        for (var i = 0; i < 12; i++)
            db.ComplianceAndRequirements.Add(TestEntityFactory.Compliance(userId, documentName: $"doc-{i}"));
        await db.SaveChangesAsync();

        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userId));

        var page2 = await repo.GetAllAsync(2, 5, DefaultQuery);

        Assert.Equal(12, page2.TotalCount);
        Assert.Equal(5, page2.Items.Count);
        Assert.Equal(2, page2.Page);
        Assert.Equal(3, page2.TotalPages);
        Assert.True(page2.HasNext);
        Assert.True(page2.HasPrevious);
    }

    [Fact]
    public async Task GetAllAsync_SortsByCreatedAtDescending_ByDefault()
    {
        var userId = Guid.NewGuid();
        var baseTime = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        using var db = TestDbContextFactory.Create();
        db.ComplianceAndRequirements.AddRange(
            TestEntityFactory.Compliance(userId, documentName: "oldest", createdAt: baseTime),
            TestEntityFactory.Compliance(userId, documentName: "newest", createdAt: baseTime.AddDays(2)),
            TestEntityFactory.Compliance(userId, documentName: "middle", createdAt: baseTime.AddDays(1)));
        await db.SaveChangesAsync();

        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userId));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Equal(new[] { "newest", "middle", "oldest" }, result.Items.Select(c => c.DocumentName));
    }

    [Fact]
    public async Task GetAllAsync_SortsByCreatedAtAscending_WhenRequested()
    {
        var userId = Guid.NewGuid();
        var baseTime = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        using var db = TestDbContextFactory.Create();
        db.ComplianceAndRequirements.AddRange(
            TestEntityFactory.Compliance(userId, documentName: "oldest", createdAt: baseTime),
            TestEntityFactory.Compliance(userId, documentName: "newest", createdAt: baseTime.AddDays(2)),
            TestEntityFactory.Compliance(userId, documentName: "middle", createdAt: baseTime.AddDays(1)));
        await db.SaveChangesAsync();

        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userId));

        var result = await repo.GetAllAsync(1, 10, new BaseQuery(Sort.created, Order.asc));

        Assert.Equal(new[] { "oldest", "middle", "newest" }, result.Items.Select(c => c.DocumentName));
    }

    [Fact]
    public async Task GetComplianceScore_ReturnsCorrectPercentage()
    {
        var userId = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.ComplianceAndRequirements.AddRange(
            TestEntityFactory.Compliance(userId, status: "Valid"),
            TestEntityFactory.Compliance(userId, status: "Valid"),
            TestEntityFactory.Compliance(userId, status: "Expired"),
            TestEntityFactory.Compliance(userId, status: "Missing")
        );
        await db.SaveChangesAsync();

        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userId));

        var score = await repo.GetComplianceScore(userId);

        // 2 Valid out of 4 total = 50%
        Assert.Equal(50, score);
    }

    [Fact]
    public async Task GetComplianceScore_Returns100_WhenNoRecordsExist()
    {
        var userId = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        var repo = new ComplianceAndRequirementsRepository(db, new StubUserContext(userId));

        var score = await repo.GetComplianceScore(userId);

        Assert.Equal(100, score);
    }
}
