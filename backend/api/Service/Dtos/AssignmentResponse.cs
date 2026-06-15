namespace Service.Dtos;

public record VesselResponse(
    Guid Id,
    string ImoNumber,
    string Name,
    string Type
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
    int DurationDays
)
{
    public static AssignmentResponse FromEntity(Domain.Entities.Assignments entity)
    {
        return new AssignmentResponse(
            entity.Id,
            entity.UserId,
            new VesselResponse(entity.Vessel.Id, entity.Vessel.ImoNumber, entity.Vessel.Name, entity.Vessel.Type),
            new PositionResponse(entity.Position.Id, entity.Position.Title),
            entity.IsPrimaryPosition,
            entity.SignOnDate,
            entity.SignOffDate,
            entity.SignOnPort,
            entity.SignOffPort,
            entity.Status,
            entity.DurationDays
        );
    }
}