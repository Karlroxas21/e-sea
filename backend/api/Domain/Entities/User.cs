namespace Domain.Entities;

public class User : Base
{
    public Guid Id { get; private set; }

    public string Email { get; private set; }

    public string Password { get; private set; }

    public string FullName { get; private set; }

    public int ComplianceScore { get; private set; }

    public string CurrentStatus { get; private set; }

    public string? AssignedVessel { get; private set; }

    public string JobTitle { get; private set; }

    public DateOnly? NextAssignmentDate { get; private set; }

    public ICollection<Trainings> Trainings { get; private set; } = [];

    public ICollection<ComplianceAndRequirements> ComplianceAndRequirements { get; private set; } = [];

    public ICollection<RecentActivityFeed> RecentActivityFeeds { get; private set; } = [];

    public static User Create(
        string email,
        string password,
        string fullName,
        int complianceScore = 0,
        string currentStatus = "not started",
        string assignedVessel = null,
        string jobTitle = ""
    )
    {
        var User = new User();

        User.Email = email;
        User.Password = password;
        User.FullName = fullName;
        User.ComplianceScore = complianceScore;
        User.CurrentStatus = currentStatus;
        User.AssignedVessel = assignedVessel;
        User.JobTitle = jobTitle;
        User.CreatedAt = DateTime.Now;

        return User;
    }
    public void UpdatePassword(string newPasword)
    {
        Password = newPasword;
    }

}