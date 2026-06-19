using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.ValueObjects;
using Domain.ValueObjects.Filters;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/principals")]
public class PrincipalController : ControllerBase
{
    private readonly IPrincipalService _principalService;

    public PrincipalController(IPrincipalService principalService)
    {
        _principalService = principalService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var data = await _principalService.GetAllAsync(page, pageSize, query ?? new BaseQuery(), ct);
        return Ok(data);
    }
}