using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Dtos;

namespace Service.Ports;

public interface IPrincipalService
{
    Task<PagedResult<PrincipalResponse>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct);
}