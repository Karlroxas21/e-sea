using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Entrypoint.Hubs;
using Service.Ports;
using Service.Dtos;
using Domain.Ports;

namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/notification")]
public class NotificationController(
    IHubContext<SignalRHub> hubContext,
    IUserContext userContext) : ControllerBase 
{
    private readonly IUserContext _userContext = userContext;
    [HttpPost("broadcast")]
    public async Task<IActionResult> Broadcast([FromBody] BroadcastRequest request, CancellationToken ct)
    {
        var userId = _userContext.UserId;
       
        var senderId = userId;
        
        var notificationDto = new NotificationDto(senderId, request.RecipientIds, request.Content, "Broadcast", DateTime.UtcNow);

        var groupNames = request.RecipientIds.Select(id => id.ToString()).ToList();

        await hubContext.Clients.Groups(groupNames).SendAsync("ReceiveNotification", notificationDto, ct);

        return Ok(notificationDto);
    }
}