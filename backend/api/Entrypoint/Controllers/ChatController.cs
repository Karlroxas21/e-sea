using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Service.Ports;
using Entrypoint.Hubs;
using Service.Dtos;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/chat")]
public class ChatController(IChatService chatService, IHubContext<ChatHub> hubContext) : ControllerBase
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

    [HttpGet("users")]
    public async Task<IActionResult> SearchUsers([FromQuery] string? query, CancellationToken ct)
    {
        var myUserIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(myUserIdClaim)) return Unauthorized();
        
        var myUserId = Guid.Parse(myUserIdClaim);
        
        var users = await chatService.SearchUsersAsync(myUserId, query ?? string.Empty, ct);
        
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Send([FromBody] SendMessageRequest request, CancellationToken ct)
    {
        var senderId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var message = await chatService.SendMessageAsync(senderId, request.RecipientId, request.Content, ct);
        
        var messageDto = new ChatMessage(
            message.Id.ToString(),
            message.SenderId.ToString(),
            message.RecipientId.ToString(),
            message.Content,
            message.CreatedAt
        );

        await hubContext.Clients.Group(request.RecipientId.ToString()).SendAsync("ReceiveMessage", messageDto, ct);
        await hubContext.Clients.Group(senderId.ToString()).SendAsync("ReceiveMessage", messageDto, ct);

        return Ok(messageDto);
    }
}

public record SendMessageRequest(Guid RecipientId, string Content);