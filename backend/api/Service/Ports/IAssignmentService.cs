using Domain.Entities;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;

namespace Service.Ports;

public interface IAssignmentService
{
    Task<PagedAssignmentResult<Assignments>> GetAllAsync(int Page, int PageSize, Status? status, BaseQuery? query, CancellationToken ct);

}