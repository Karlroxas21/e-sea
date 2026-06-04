namespace Domain.Entities;

public class RecentActivityFeed : Base
{
    public Guid Id { get; private set; }
    public string ActivityType { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; }
}