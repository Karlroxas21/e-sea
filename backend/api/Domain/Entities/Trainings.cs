namespace Domain.Entities;

public class Trainings : Base
{
    public Guid Id { get; private set; }
    public string Title { get; set; }
    public string ProviderOrLocation { get; set; }
    public string Status { get; set; }
    public DateTime ScheduleDate { get; set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; }
}
