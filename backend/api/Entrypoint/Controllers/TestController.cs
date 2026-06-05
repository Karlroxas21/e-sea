using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/documents")]
public class MiscController : ControllerBase
{
    [Authorize]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingDocuments()
    {
        int pending = 5;
        return Ok(new { pending = pending });
    }

    [Authorize]
    [HttpGet("open-jobs")]
    public async Task<IActionResult> GetOpenJobPosts()
    {
        int open = 12;
        return Ok(new { open = open });
    }
}
