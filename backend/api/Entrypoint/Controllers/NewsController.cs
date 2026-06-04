using Domain.ValueObjects;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/news")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var data = await _newsService.GetAllAsync(page, pageSize, query, ct);

        return Ok(data);
    }
}
