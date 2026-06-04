using Microsoft.AspNetCore.Mvc;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api")]
public class TestController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetTest()
    {
        return Ok();
    }
}
