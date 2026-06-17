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
    public string? Warning { get; private set; }
    public int DurationDays { get; private set; }
    public User User { get; private set; }
    public Vessles Vessel { get; private set; }
    public Positions Position { get; private set; }

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