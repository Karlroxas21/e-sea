using Domain.ValueObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/compliance-requirements")]
public class ComplianceAndRequirementsController : ControllerBase
{
    private readonly IComplianceAndRequirementsService _complianceAndRequirementsService;

    public ComplianceAndRequirementsController(IComplianceAndRequirementsService complianceAndRequirementsService)
    {
        _complianceAndRequirementsService = complianceAndRequirementsService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var data = await _complianceAndRequirementsService.GetAllAsync(page, pageSize, query, ct);

        return Ok(data);
    }

    [Authorize]
    [HttpGet("score")]
    public async Task<IActionResult> GetComplianceScore(CancellationToken ct = default)
    {
        var score = await _complianceAndRequirementsService.GetComplianceScoreAsync(ct);
        return Ok(score);
    }
}