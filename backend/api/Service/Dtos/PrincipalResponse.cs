using Domain.Entities;

namespace Service.Dtos;

public record PrincipalResponse(Guid Id, string Name)
{
    public static PrincipalResponse FromEntity(Principal entity)
    {
        return new PrincipalResponse(entity.Id, entity.Name);
    }
}