using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Service.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/chat")]
public class ChatController(IChatService chatService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetHistory(CancellationToken ct)
    {
        var myUserIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(myUserIdClaim)) return Unauthorized();
        
        var myUserId = Guid.Parse(myUserIdClaim);

        var history = await chatService.GetHistorySummaryAsync(myUserId, ct);
        
        return Ok(history);
    }

    [HttpGet("{otherUserId:guid}")]
    public async Task<IActionResult> GetChat(Guid otherUserId, CancellationToken ct)
    {
        var myUserIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(myUserIdClaim)) return Unauthorized();
        
        var myUserId = Guid.Parse(myUserIdClaim);
        
        var messages = await chatService.GetChatMessagesAsync(myUserId, otherUserId, ct);
        
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> Send([FromBody] SendMessageRequest request, CancellationToken ct)
    {
        var senderId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await chatService.SendMessageAsync(senderId, request.RecipientId, request.Content, ct);
        return Ok();
    }
}

public record SendMessageRequest(Guid RecipientId, string Content);