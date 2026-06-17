using Domain.Entities;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Dtos;

namespace Service.Ports;

public interface IAssignmentService
{
    Task<PagedAssignmentResult<AssignmentResponse>> GetAllAsync(int Page, int PageSize, Status? status, BaseQuery? query, CancellationToken ct);
    Task SyncAssignmentWarningAsync(CancellationToken ct);
    Task<int> GetSeaTimeAcrossCompletedAssignments(CancellationToken ct);
}