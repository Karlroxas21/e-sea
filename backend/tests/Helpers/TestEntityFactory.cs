using System.Reflection;
using Domain.Entities;

namespace Tests.Helpers;

/// <summary>
/// Domain entities use private setters and have no public factories (except User).
/// These helpers build fully-populated entities for tests via reflection so the
/// EF Core InMemory provider can persist them.
/// </summary>
public static class TestEntityFactory
{
    private static void Set<T>(T entity, string property, object? value)
    {
        var prop = typeof(T).GetProperty(property, BindingFlags.Public | BindingFlags.Instance)
            ?? throw new InvalidOperationException($"Property {property} not found on {typeof(T).Name}");
        prop.SetValue(entity, value);
    }

    public static User User(
        Guid id,
        string email = "user@example.com",
        string fullName = "Test User",
        string password = "hashed-password")
    {
        var user = Domain.Entities.User.Create(email, password, fullName);
        Set(user, nameof(Domain.Entities.User.Id), id);
        return user;
    }

    public static ComplianceAndRequirements Compliance(
        Guid userId,
        Guid? id = null,
        string documentName = "Passport",
        string status = "valid",
        bool isRequired = true,
        DateTime? createdAt = null,
        DateTime? updatedAt = null,
        DateTime? deletedAt = null)
    {
        var c = new ComplianceAndRequirements();
        Set(c, nameof(ComplianceAndRequirements.Id), id ?? Guid.NewGuid());
        Set(c, nameof(ComplianceAndRequirements.DocumentName), documentName);
        Set(c, nameof(ComplianceAndRequirements.Status), status);
        Set(c, nameof(ComplianceAndRequirements.IsRequired), isRequired);
        Set(c, nameof(ComplianceAndRequirements.UserId), userId);
        c.CreatedAt = createdAt ?? DateTime.UtcNow;
        c.UpdatedAt = updatedAt;
        c.DeletedAt = deletedAt;
        return c;
    }

    public static Trainings Training(
        Guid userId,
        Guid? id = null,
        string title = "Fire Safety",
        string providerOrLocation = "HQ",
        string status = "scheduled",
        DateTime? scheduleDate = null,
        DateTime? createdAt = null,
        DateTime? updatedAt = null,
        DateTime? deletedAt = null)
    {
        var t = new Trainings
        {
            Title = title,
            ProviderOrLocation = providerOrLocation,
            Status = status,
            ScheduleDate = scheduleDate ?? DateTime.UtcNow.AddDays(7),
        };
        Set(t, nameof(Trainings.Id), id ?? Guid.NewGuid());
        Set(t, nameof(Trainings.UserId), userId);
        t.CreatedAt = createdAt ?? DateTime.UtcNow;
        t.UpdatedAt = updatedAt;
        t.DeletedAt = deletedAt;
        return t;
    }

    public static RecentActivityFeed Activity(
        Guid userId,
        Guid? id = null,
        string activityType = "login",
        string title = "Signed in",
        string description = "User signed in",
        DateTime? createdAt = null,
        DateTime? updatedAt = null,
        DateTime? deletedAt = null)
    {
        var a = new RecentActivityFeed();
        Set(a, nameof(RecentActivityFeed.Id), id ?? Guid.NewGuid());
        Set(a, nameof(RecentActivityFeed.ActivityType), activityType);
        Set(a, nameof(RecentActivityFeed.Title), title);
        Set(a, nameof(RecentActivityFeed.Description), description);
        Set(a, nameof(RecentActivityFeed.UserId), userId);
        a.CreatedAt = createdAt ?? DateTime.UtcNow;
        a.UpdatedAt = updatedAt;
        a.DeletedAt = deletedAt;
        return a;
    }

    public static Domain.Entities.News News(
        Guid? id = null,
        string category = "Safety",
        string title = "New regulation",
        DateOnly? publishDate = null,
        int readTimeMinutes = 5,
        DateTime? createdAt = null,
        DateTime? updatedAt = null,
        DateTime? deletedAt = null)
    {
        var n = new Domain.Entities.News();
        Set(n, nameof(Domain.Entities.News.Id), id ?? Guid.NewGuid());
        Set(n, nameof(Domain.Entities.News.Category), category);
        Set(n, nameof(Domain.Entities.News.Title), title);
        Set(n, nameof(Domain.Entities.News.PublishDate), publishDate ?? new DateOnly(2026, 1, 1));
        Set(n, nameof(Domain.Entities.News.ReadTimeMinutes), readTimeMinutes);
        Set(n, nameof(Domain.Entities.News.ThumbnailUrl), "https://example.com/thumb.png");
        Set(n, nameof(Domain.Entities.News.ContentUrl), "https://example.com/content");
        n.CreatedAt = createdAt ?? DateTime.UtcNow;
        n.UpdatedAt = updatedAt;
        n.DeletedAt = deletedAt;
        return n;
    }
}
