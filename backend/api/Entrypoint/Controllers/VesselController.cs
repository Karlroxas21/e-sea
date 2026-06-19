using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/vessels")]
public class VesselController : ControllerBase
{
    private readonly IVesselService _vesselService;

    public VesselController(IVesselService vesselService)
    {
        _vesselService = vesselService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var data = await _vesselService.GetAllAsync(page, pageSize, query, ct);
        return Ok(data);
    }
}