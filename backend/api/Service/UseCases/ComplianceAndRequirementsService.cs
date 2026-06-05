using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class ComplianceAndRequirementsService : IComplianceAndRequirementsService
{
    private readonly IComplianceAndRequirementsRepository _complianceAndRequirementsRepository;
    private readonly IUserContext _userContext;

    public ComplianceAndRequirementsService(
        IComplianceAndRequirementsRepository complianceAndRequirementsRepository,
        IUserContext userContext)
    {
        _complianceAndRequirementsRepository = complianceAndRequirementsRepository;
        _userContext = userContext;
    }

    public async Task<PagedResult<ComplianceAndReqResponse>> GetAllAsync(int page, int pageSize, BaseQuery query, CancellationToken ct = default)
    {
        var pageRes = await _complianceAndRequirementsRepository.GetAllAsync(page, pageSize, query, ct);

        var items = pageRes.Items.Select(ComplianceAndReqResponse.FromEntity).ToList();

        return new PagedResult<ComplianceAndReqResponse>(items, pageRes.Page, pageRes.PageSize, pageRes.TotalCount);
    }

    public async Task<ComplianceScoreResponse> GetComplianceScoreAsync(CancellationToken ct = default)
    {
        var result = await _complianceAndRequirementsRepository.GetComplianceScore(_userContext.UserId, ct);

        return new ComplianceScoreResponse(
            result.Score,
            new ComplianceScoreDetails(
                result.MissingCount,
                result.ExpiredExpiringSoonPendingCount
            )
        );
    }

}