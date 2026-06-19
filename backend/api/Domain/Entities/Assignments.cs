namespace Domain.Entities;

public class Assignments : Base
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid VesselId { get; private set; }
    public Guid PositionId { get; private set; }
    public bool IsPrimaryPosition { get; private set; }
    public Guid PrincipalId { get; private set; }
    public Principal Principal { get; private set; } = null!;
    public DateOnly SignOnDate { get; private set; }
    public DateOnly SignOffDate { get; private set; }
    public string SignOnPort { get; private set; } = null!;
    public string SignOffPort { get; private set; } = null!;
    public string Status { get; private set; } = null!;
    public string? Warning { get; private set; }
    public int DurationDays { get; private set; }
    public User User { get; private set; } = null!;
    public Vessles Vessel { get; private set; } = null!;
    public Positions Position { get; private set; } = null!;

    public static Assignments Create(
        Guid userId, 
        Guid vesselId, 
        Guid positionId, 
        Guid principalId,
        DateOnly signOnDate, 
        DateOnly signOffDate, 
        string signOnPort, 
        string signOffPort)
    {
        int duration = signOffDate.DayNumber - signOnDate.DayNumber;
        if (duration < 0)
        {
            throw new ArgumentException("Sign-off date cannot be earlier than the Sign-on date.");
        }

        return new Assignments
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            VesselId = vesselId,
            PositionId = positionId,
            IsPrimaryPosition = true,
            PrincipalId = principalId,
            SignOnDate = signOnDate,
            SignOffDate = signOffDate,
            SignOnPort = signOnPort,
            SignOffPort = signOffPort,
            Status = "upcoming",
            DurationDays = duration,
            Warning = "Scheduled"
        };
    }

    public void CheckCompliance()
    {
        if (Vessel == null || User == null) return;

        var vesselRequirements = Vessel.VesselRequirements.Select(vr => vr.DocumentTypeId).ToList();
        var userDocuments = User.ComplianceAndRequirements;

        bool allMet = true;
        bool actionNeeded = false;
        bool atRisk = false;

        foreach (var reqDocTypeId in vesselRequirements)
        {
            var userDoc = userDocuments.FirstOrDefault(ud => ud.DocumentTypeId == reqDocTypeId);
            if (userDoc == null)
            {
                allMet = false;
                actionNeeded = true;
                break;
            }

            if (userDoc.Status == "Expired")
            {
                actionNeeded = true;
                break;
            }

            if (userDoc.Status == "Pending Review")
            {
                atRisk = true;
            }

            if (userDoc.ExpiryDate.HasValue && userDoc.ExpiryDate.Value <= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)))
            {
                atRisk = true;
            }
        }

        if (Status == "upcoming")
        {
            Warning = actionNeeded ? "Action Needed" : "Scheduled";
        }
        else
        {
            Warning = null;
        }
    }
}