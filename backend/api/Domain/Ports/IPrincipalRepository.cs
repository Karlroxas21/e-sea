using Domain.Entities;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;

namespace Domain.Ports;

public interface IPrincipalRepository
{
    Task<PagedResult<Principal>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct);
}