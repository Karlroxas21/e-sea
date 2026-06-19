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

    public async Task SyncAssignmentWarningAsync(CancellationToken ct)
    {
        var userId = _userContext.UserId;
        var upcomingAssignments = await _assignmentRepository.GetUpcomingAssignmentsAsync(userId, ct);

        // foreach(var a in upcomingAssignments)
        // {
        //     Console.WriteLine(a.Id);
        // }
       
        foreach (var assignment in upcomingAssignments)
        {
            assignment.CheckCompliance();
            await _assignmentRepository.UpdateAsync(assignment, ct);
        }
    }

    public async Task<int> GetSeaTimeAcrossCompletedAssignments(CancellationToken ct)
    {
        return await _assignmentRepository.GetSeaTimeAcrossCompletedAssignments(ct);
    }

    public async Task<AssignmentResponse> CreateAsync(CreateAssignmentRequest request, CancellationToken ct)
    {
        var userId = _userContext.UserId;

        var assignment = Assignments.Create(
            userId,
            request.VesselId,
            request.PositionId,
            request.PrincipalId,
            request.SignOnDate,
            request.SignOffDate,
            request.SignOnPort,
            request.SignOffPort
        );

        await _assignmentRepository.AddAsync(assignment, ct);

        var fullyLoadedAssignment = await _assignmentRepository.GetByIdAsync(assignment.Id, ct);

        return AssignmentResponse.FromEntity(fullyLoadedAssignment);
    }
}