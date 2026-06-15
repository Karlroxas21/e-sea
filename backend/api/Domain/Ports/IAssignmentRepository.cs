using Domain.Entities;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;

namespace Domain.Ports;

public interface IAssignmentRepository
{
    Task<PagedAssignmentResult<Assignments>> GetAllAsync(int Page, int PageSize, Status? status, BaseQuery? query, CancellationToken ct);
    Task<List<Assignments>> GetUpcomingAssignmentsAsync(Guid userId, CancellationToken ct);
    Task UpdateAsync(Assignments assignment, CancellationToken ct);
}
