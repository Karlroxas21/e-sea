using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class VesselService : IVesselService
{
    private readonly IVesselRepository _vesselRepository;

    public VesselService(IVesselRepository vesselRepository)
    {
        _vesselRepository = vesselRepository;
    }

    public async Task<PagedResult<VesselLookupResponse>> GetAllAsync(int page, int pageSize, BaseQuery? query, CancellationToken ct)
    {
        var result = await _vesselRepository.GetAllAsync(page, pageSize, query, ct);

        var items = result.Items.Select(VesselLookupResponse.FromEntity).ToList();

        return new PagedResult<VesselLookupResponse>(
            items,
            result.Page,
            result.PageSize,
            result.TotalCount
        );
    }
}