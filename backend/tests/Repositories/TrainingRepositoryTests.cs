using Domain.ValueObjects;
using Infrastructure.Persistence;
using Tests.Helpers;
using Xunit;

namespace Tests.Repositories;

/// <summary>IDOR scoping + soft-delete for trainings (commit 42efddd).</summary>
public class TrainingRepositoryTests
{
    private static readonly BaseQuery DefaultQuery = new();

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyCurrentUsersRecords()
    {
        var userA = Guid.NewGuid();
        var userB = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.Trainings.AddRange(
            TestEntityFactory.Training(userA, title: "A-train"),
            TestEntityFactory.Training(userB, title: "B-train"));
        await db.SaveChangesAsync();

        var repo = new TrainingRepository(db, new StubUserContext(userA));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        var item = Assert.Single(result.Items);
        Assert.Equal("A-train", item.Title);
        Assert.Equal(userA, item.UserId);
    }

    [Fact]
    public async Task GetAllAsync_DoesNotLeakOtherUsersRecords()
    {
        var attacker = Guid.NewGuid();
        var victim = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.Trainings.Add(TestEntityFactory.Training(victim, title: "confidential"));
        await db.SaveChangesAsync();

        var repo = new TrainingRepository(db, new StubUserContext(attacker));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_ExcludesSoftDeletedRecords()
    {
        var userId = Guid.NewGuid();
        using var db = TestDbContextFactory.Create();
        db.Trainings.AddRange(
            TestEntityFactory.Training(userId, title: "live"),
            TestEntityFactory.Training(userId, title: "deleted", deletedAt: DateTime.UtcNow));
        await db.SaveChangesAsync();

        var repo = new TrainingRepository(db, new StubUserContext(userId));

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        var item = Assert.Single(result.Items);
        Assert.Equal("live", item.Title);
    }
}
