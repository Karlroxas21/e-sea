using Domain.ValueObjects;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/positions")]
public class PositionController : ControllerBase
{
    private readonly IPositionService _positionService;

    public PositionController(IPositionService positionService) => _positionService = positionService;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10, 
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var result = await _positionService.GetAllAsync(page, pageSize, query, ct);
        return Ok(result);
    }
}