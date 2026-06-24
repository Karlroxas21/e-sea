using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;
using Service.Dtos;
using FluentValidation;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/assignments")]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        [FromQuery] Status? status = null,
        CancellationToken ct = default)
    {
        var data = await _assignmentService.GetAllAsync(page, pageSize, status, query, ct);

        return Ok(data);
    }

    [Authorize]
    [HttpPost("sync-compliance")]
    public async Task<IActionResult> SyncCompliance(CancellationToken ct)
    {
        await _assignmentService.SyncAssignmentWarningAsync(ct);
        return NoContent();
    }

    [Authorize]
    [HttpGet("sea-time")]
    public async Task<IActionResult> GetSeaTimeAcrossCompletedAssignments(
       CancellationToken ct = default)
    {
        var num = await _assignmentService.GetSeaTimeAcrossCompletedAssignments(ct);

        return Ok(new { totalSeaDays = num });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentRequest request, [FromServices] IValidator<CreateAssignmentRequest> validator, CancellationToken ct)
    {
        await validator.ValidateAndThrowAsync(request, ct);
        
        var baseResponse = await _assignmentService.CreateAsync(request, ct);
        
        return Ok(baseResponse);
    }
}