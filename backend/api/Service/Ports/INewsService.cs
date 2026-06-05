using Domain.ValueObjects;
using Service.Dtos;

namespace Service.Ports;

public interface INewsService
{
    Task<PagedResult<NewsResponse>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);
}