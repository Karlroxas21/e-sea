using Domain.ValueObjects;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/trainings")]
public class TrainingController : ControllerBase
{
    private readonly ITrainingService _trainingService;

    public TrainingController(ITrainingService trainingService)
    {
        _trainingService = trainingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] BaseQuery? query = null,
        CancellationToken ct = default)
    {
        var data = await _trainingService.GetAllAsync(page, pageSize, query, ct);

        return Ok(data);
    }
}
