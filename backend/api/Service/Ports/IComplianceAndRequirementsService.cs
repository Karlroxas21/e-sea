using Domain.Entities;
using Domain.ValueObjects;

namespace Service.Ports;

public interface IComplianceAndRequirementsService
{
    Task<PagedResult<ComplianceAndReqResponse>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);
}