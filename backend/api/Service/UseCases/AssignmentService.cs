using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class AssignmentService : IAssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly IUserContext _userContext;

    public AssignmentService(IAssignmentRepository assignmentRepository, IUserContext userContext)
    {
        _assignmentRepository = assignmentRepository;
        _userContext = userContext;
    }
    public async Task<PagedAssignmentResult<AssignmentResponse>> GetAllAsync(int Page, int PageSize, Status? status, BaseQuery? query, CancellationToken ct)
    {
        var result = await _assignmentRepository.GetAllAsync(Page, PageSize, status, query, ct);

        var items = result.Items.Select(AssignmentResponse.FromEntity).ToList();

        return new PagedAssignmentResult<AssignmentResponse>(
            items,
            result.Page,
            result.PageSize,
            result.TotalCount,
            result.TotalActive,
            result.TotalUpcoming,
            result.TotalHistory,
            result.All
        );
    }

    public async Task RefreshAssignmentStatusesAsync(CancellationToken ct)
    {
        var userId = _userContext.UserId;
        var upcomingAssignments = await _assignmentRepository.GetUpcomingAssignmentsAsync(userId, ct);

        foreach (var assignment in upcomingAssignments)
        {
            assignment.UpdateStatusFromCompliance();
            await _assignmentRepository.UpdateAsync(assignment, ct);
        }
    }
}