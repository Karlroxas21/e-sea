using Domain.Entities;

namespace Service.Dtos;

public record VesselLookupResponse(
    Guid Id,
    string ImoNumber,
    string Name,
    string Type
)
{
    public static VesselLookupResponse FromEntity(Vessles entity)
    {
        return new VesselLookupResponse(
            entity.Id,
            entity.ImoNumber,
            entity.Name,
            entity.Type
        );
    }
}