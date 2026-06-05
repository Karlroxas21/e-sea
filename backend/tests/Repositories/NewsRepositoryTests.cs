using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Infrastructure.Persistence;
using Tests.Helpers;
using Xunit;

namespace Tests.Repositories;

/// <summary>News is global (not user-scoped) — verify it is NOT filtered by user.</summary>
public class NewsRepositoryTests
{
    private static readonly BaseQuery DefaultQuery = new();

    [Fact]
    public async Task GetAllAsync_ReturnsAllNews_NotUserScoped()
    {
        using var db = TestDbContextFactory.Create();
        db.News.AddRange(
            TestEntityFactory.News(title: "n1"),
            TestEntityFactory.News(title: "n2"),
            TestEntityFactory.News(title: "n3"));
        await db.SaveChangesAsync();

        var repo = new NewsRepository(db);

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Equal(3, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_ExcludesSoftDeletedNews()
    {
        using var db = TestDbContextFactory.Create();
        db.News.AddRange(
            TestEntityFactory.News(title: "live"),
            TestEntityFactory.News(title: "deleted", deletedAt: DateTime.UtcNow));
        await db.SaveChangesAsync();

        var repo = new NewsRepository(db);

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        var item = Assert.Single(result.Items);
        Assert.Equal("live", item.Title);
    }

    [Fact]
    public async Task GetAllAsync_SortsByCreatedAtDescending_ByDefault()
    {
        var baseTime = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        using var db = TestDbContextFactory.Create();
        db.News.AddRange(
            TestEntityFactory.News(title: "oldest", createdAt: baseTime),
            TestEntityFactory.News(title: "newest", createdAt: baseTime.AddDays(2)),
            TestEntityFactory.News(title: "middle", createdAt: baseTime.AddDays(1)));
        await db.SaveChangesAsync();

        var repo = new NewsRepository(db);

        var result = await repo.GetAllAsync(1, 10, DefaultQuery);

        Assert.Equal(new[] { "newest", "middle", "oldest" }, result.Items.Select(n => n.Title));
    }

    [Fact]
    public async Task GetAllAsync_SortsByUpdatedAtAscending_WhenRequested()
    {
        var baseTime = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        using var db = TestDbContextFactory.Create();
        db.News.AddRange(
            TestEntityFactory.News(title: "first", updatedAt: baseTime.AddDays(1)),
            TestEntityFactory.News(title: "second", updatedAt: baseTime.AddDays(2)),
            TestEntityFactory.News(title: "third", updatedAt: baseTime.AddDays(3)));
        await db.SaveChangesAsync();

        var repo = new NewsRepository(db);

        var result = await repo.GetAllAsync(1, 10, new BaseQuery(Sort.updated, Order.asc));

        Assert.Equal(new[] { "first", "second", "third" }, result.Items.Select(n => n.Title));
    }
}
