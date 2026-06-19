using Domain.Entities;
using Domain.ValueObjects;

namespace Service.Ports;

public interface IPositionService
{
    Task<PagedResult<Positions>> GetAllAsync(int Page, int PageSize, BaseQuery? query, CancellationToken ct);
}