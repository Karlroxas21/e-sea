using Domain.Entities;
using Domain.ValueObjects;

namespace Domain.Ports;

public interface IRecentActivityRepository
{
    Task<PagedResult<RecentActivityFeed>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);

}