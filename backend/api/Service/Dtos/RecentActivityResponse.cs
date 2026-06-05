using Domain.Entities;

namespace Service.Dtos;

public record RecentActivityResponse(
    Guid Id,
    string ActivityType,
    string Title,
    string Description,
    Guid UserId,
    DateTime CreatedAt
)
{
    public static RecentActivityResponse FromEntity(RecentActivityFeed activity)
    {
        return new RecentActivityResponse(
            activity.Id,
            activity.ActivityType,
            activity.Title,
            activity.Description,
            activity.UserId,
            activity.CreatedAt
        );
    }
}
