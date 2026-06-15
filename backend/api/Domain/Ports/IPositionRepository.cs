using Domain.Entities;
using Domain.ValueObjects;

namespace Domain.Ports;

public interface IPositionRepository
{
    Task<PagedResult<Positions>> GetAllAsync(int Page, int PageSize, BaseQuery? query, CancellationToken ct);
}
