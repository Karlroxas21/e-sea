using Domain.Entities;

namespace Service.Dtos;

public record UserResponse(
    Guid Id,
    string Jwt,
    string Email,
    string FullName,
    int ComplianceScore,
    string CurrentStatus,
    string? AssignedVessel,
    string JobTitle,
    DateOnly? NextAssignmentDate
)

{
    public static UserResponse ToUserResponse(User user, string jwt)
    {
        return new UserResponse(
            user.Id,
            jwt,
            user.Email,
            user.FullName,
            user.ComplianceScore,
            user.CurrentStatus,
            user.AssignedVessel,
            user.JobTitle,
            user.NextAssignmentDate
        );
    }
}