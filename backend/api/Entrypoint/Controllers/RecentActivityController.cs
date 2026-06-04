using Domain.ValueObjects;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/recent-activities")]
public class RecentActivityController : ControllerBase
{
    private readonly IRecentActivityFeedService _recentActivityFeedService;

    public RecentActivityController(IRecentActivityFeedService recentActivityFeedService)
    {
        _recentActivityFeedService = recentActivityFeedService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var data = await _recentActivityFeedService.GetAllAsync(page, pageSize, query, ct);

        return Ok(data);
    }
}
