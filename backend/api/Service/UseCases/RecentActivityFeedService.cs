using Domain.Ports;
using Domain.ValueObjects;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class RecentActivityFeedService : IRecentActivityFeedService
{
    private readonly IRecentActivityRepository _recentActivityRepository;

    public RecentActivityFeedService(IRecentActivityRepository recentActivityRepository)
    {
        _recentActivityRepository = recentActivityRepository;
    }

    public async Task<PagedResult<RecentActivityResponse>> GetAllAsync(int page, int pageSize, BaseQuery query, CancellationToken ct = default)
    {
        var pageRes = await _recentActivityRepository.GetAllAsync(page, pageSize, query, ct);

        var items = pageRes.Items.Select(RecentActivityResponse.FromEntity).ToList();

        return new PagedResult<RecentActivityResponse>(items, pageRes.Page, pageRes.PageSize, pageRes.TotalCount);
    }
}
