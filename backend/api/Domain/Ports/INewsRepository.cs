using Domain.Entities;
using Domain.ValueObjects;

namespace Domain.Ports;

public interface INewsRepository
{
    Task<PagedResult<News>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);

}