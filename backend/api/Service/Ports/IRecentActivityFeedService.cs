using Domain.ValueObjects;
using Service.Dtos;

namespace Service.Ports;

public interface IRecentActivityFeedService
{
    Task<PagedResult<RecentActivityResponse>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);
}