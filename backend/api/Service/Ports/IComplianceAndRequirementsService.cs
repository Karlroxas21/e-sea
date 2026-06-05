using Domain.ValueObjects;
using Service.Dtos;

namespace Service.Ports;

public interface IComplianceAndRequirementsService
{
    Task<PagedResult<ComplianceAndReqResponse>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);
    Task<ComplianceScoreResponse> GetComplianceScoreAsync(CancellationToken ct = default);
}