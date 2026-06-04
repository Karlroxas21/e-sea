using Domain.Ports;
using Domain.ValueObjects;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class NewsService : INewsService
{
    private readonly INewsRepository _newsRepository;

    public NewsService(INewsRepository newsRepository)
    {
        _newsRepository = newsRepository;
    }

    public async Task<PagedResult<NewsResponse>> GetAllAsync(int page, int pageSize, BaseQuery query, CancellationToken ct = default)
    {
        var pageRes = await _newsRepository.GetAllAsync(page, pageSize, query, ct);

        var items = pageRes.Items.Select(NewsResponse.FromEntity).ToList();

        return new PagedResult<NewsResponse>(items, pageRes.Page, pageRes.PageSize, pageRes.TotalCount);
    }
}
