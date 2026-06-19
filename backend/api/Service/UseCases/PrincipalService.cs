using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class PrincipalService : IPrincipalService
{
    private readonly IPrincipalRepository _principalRepository;

    public PrincipalService(IPrincipalRepository principalRepository)
    {
        _principalRepository = principalRepository;
    }

    public async Task<PagedResult<PrincipalResponse>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct)
    {
        var result = await _principalRepository.GetAllAsync(page, pageSize, query, ct);

        var items = result.Items.Select(PrincipalResponse.FromEntity).ToList();

        return new PagedResult<PrincipalResponse>(
            items,
            result.Page,
            result.PageSize,
            result.TotalCount
        );
    }
}