using Domain.Entities;
using Domain.ValueObjects;

namespace Domain.Ports;

public interface IComplianceAndRequirementsRepository
{
    Task<PagedResult<ComplianceAndRequirements>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);

}