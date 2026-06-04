namespace Domain.Entities;

public class ComplianceAndRequirements : Base
{
    public Guid Id { get; private set; }
    public string DocumentName { get; private set; }
    public string Status { get; private set; }
    public DateOnly? ExpiryDate { get; private set; }
    public bool IsRequired { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; }
}