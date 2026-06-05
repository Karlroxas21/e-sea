using Domain.ValueObjects;
using Infrastructure.Persistence;
using Tests.Helpers;
using Xunit;

namespace Tests.Repositories;

/// <summary>IDOR scoping + soft-delete for recent activity feed (commit 42efddd).</summary>
public class RecentActivityRepositoryTests
{
    private static readonly BaseQuery DefaultQuery = new();

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyCurrentUsersRecords()
    {
        var userA = Guid.NewGuid();
        var userB = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.RecentActivityFeeds.AddRange(
            TestEntityFactory.Activity(userA, title: "A-act"),
            TestEntityFactory.Activity(userB, title: "B-act"));
        await db.SaveChangesAsync();

        var repo = new RecentActivityRepository(db, new StubUserContext(userA));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        var item = Assert.Single(result.Items);
        Assert.Equal("A-act", item.Title);
        Assert.Equal(userA, item.UserId);
    }

    [Fact]
    public async Task GetAllAsync_DoesNotLeakOtherUsersRecords()
    {
        var attacker = Guid.NewGuid();
        var victim = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.RecentActivityFeeds.Add(TestEntityFactory.Activity(victim, title: "private"));
        await db.SaveChangesAsync();

        var repo = new RecentActivityRepository(db, new StubUserContext(attacker));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_ExcludesSoftDeletedRecords()
    {
        var userId = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.RecentActivityFeeds.AddRange(
            TestEntityFactory.Activity(userId, title: "live"),
            TestEntityFactory.Activity(userId, title: "deleted", deletedAt: DateTime.UtcNow));
        await db.SaveChangesAsync();

        var repo = new RecentActivityRepository(db, new StubUserContext(userId));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        var item = Assert.Single(result.Items);
        Assert.Equal("live", item.Title);
    }
}
