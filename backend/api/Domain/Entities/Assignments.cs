namespace Domain.Entities;

public class Assignments : Base
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid VesselId { get; private set; }
    public Guid PositionId { get; private set; }
    public bool IsPrimaryPosition { get; private set; }
    public DateOnly SignOnDate { get; private set; }
    public DateOnly SignOffDate { get; private set; }
    public string SignOnPort { get; private set; }
    public string SignOffPort { get; private set; }
    public string Status { get; private set; }
    public int DurationDays { get; private set; }
    public User User { get; private set; }
    public Vessles Vessel { get; private set; }
    public Positions Position { get; private set; }

}