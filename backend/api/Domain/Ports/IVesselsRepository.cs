using Domain.Entities;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;

namespace Domain.Ports;

public interface IVesselRepository
{
    Task<PagedResult<Vessles>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct);
}