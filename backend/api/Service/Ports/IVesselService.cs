using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Dtos;

namespace Service.Ports;

public interface IVesselService
{
    Task<PagedResult<VesselLookupResponse>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct);
}