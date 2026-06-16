using System.Net.NetworkInformation;
using Domain.Entities;

namespace Service.Dtos;

public record ComplianceAndReqResponse(
    Guid Id,
    string DocumentName,
    string Status,
    DateOnly? ExpiryDate,
    bool IsRequired,
    Guid UserId
)
{
    public static ComplianceAndReqResponse FromEntity(ComplianceAndRequirements car)
    {
        return new ComplianceAndReqResponse(
            car.Id,
            car.DocumentName,
            car.Status,
            car.ExpiryDate,
            car.IsRequired,
            car.UserId
        );
    }
}