using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Service.Ports;

namespace Service.UseCases;

public class ComplianceAndRequirementsService : IComplianceAndRequirementsService
{
    private readonly IComplianceAndRequirementsRepository _complianceAndRequirementsRepository;

    public ComplianceAndRequirementsService(IComplianceAndRequirementsRepository complianceAndRequirementsRepository)
    {
        _complianceAndRequirementsRepository = complianceAndRequirementsRepository;
    }
    public async Task<PagedResult<ComplianceAndReqResponse>> GetAllAsync(int page, int pageSize, BaseQuery query, CancellationToken ct = default)
    {
        var pageRes = await _complianceAndRequirementsRepository.GetAllAsync(page, pageSize, query, ct);

        var items = pageRes.Items.Select(ComplianceAndReqResponse.FromEntity).ToList();

        return new PagedResult<ComplianceAndReqResponse>(items, pageRes.Page, pageRes.PageSize, pageRes.TotalCount);
    }
}