using Domain.Entities;

namespace Service.Dtos;

public record CreateAssignmentRequest(
    Guid VesselId,
    Guid PositionId,
    Guid PrincipalId,
    DateOnly SignOnDate,
    DateOnly SignOffDate,
    string SignOnPort,
    string SignOffPort
);
public record VesselRequirementResponse(
    Guid DocumentTypeId,
    string DocumentName
);

public record VesselResponse(
    Guid Id,
    string ImoNumber,
    string Name,
    string Type,
    IEnumerable<VesselRequirementResponse> VesselRequirements
);

public record PositionResponse(
    Guid Id,
    string Title
);

public record AssignmentResponse(
    Guid Id,
    Guid UserId,
    VesselResponse Vessel,
    PositionResponse Position,
    bool IsPrimaryPosition,
    DateOnly SignOnDate,
    DateOnly SignOffDate,
    string SignOnPort,
    string SignOffPort,
    string Status,
    string? Warning,
    int DurationDays,
    IEnumerable<ComplianceAndReqResponse> ComplianceRequirements
)
{
    public static AssignmentResponse FromEntity(Assignments entity)
    {
        return new AssignmentResponse(
            entity.Id,
            entity.UserId,
            new VesselResponse(
                entity.Vessel.Id,
                entity.Vessel.ImoNumber,
                entity.Vessel.Name,
                entity.Vessel.Type,
                entity.Vessel.VesselRequirements.Select(vr => new VesselRequirementResponse(vr.DocumentTypeId, vr.DocumentType?.Name ?? "Unknown"))
            ),
            new PositionResponse(entity.Position.Id, entity.Position.Title),
            entity.IsPrimaryPosition,
            entity.SignOnDate,
            entity.SignOffDate,
            entity.SignOnPort,
            entity.SignOffPort,
            entity.Status,
            entity.Warning,
            entity.DurationDays,
            entity.User.ComplianceAndRequirements.Select(ComplianceAndReqResponse.FromEntity)
        );
    }
}