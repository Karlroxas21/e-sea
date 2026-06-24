using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Service.Ports;
using Service.Dtos;
using Domain.Ports;

namespace Entrypoint.Hubs;

[Authorize]
public class SignalRHub(IChatService chatService) : Hub
{
    private readonly IUserContext _userContext;
    public override async Task OnConnectedAsync()
    {
        var myUserId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(myUserId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, myUserId);
        }
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var myUserId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(myUserId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, myUserId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(SendMessageHubRequest request)
    {
        var senderIdClaim = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(senderIdClaim)) return;

        var senderId = Guid.Parse(senderIdClaim);
        var message = await chatService.SendMessageAsync(senderId, request.ReceiverId, request.Content, default);

        var messageDto = new ChatMessage(
            message.Id.ToString(),
            message.SenderId.ToString(),
            message.RecipientId.ToString(),
            message.Content,
            message.CreatedAt
        );

        await Clients.Group(request.ReceiverId.ToString()).SendAsync("ReceiveMessage", messageDto);
        await Clients.Group(senderId.ToString()).SendAsync("ReceiveMessage", messageDto);
    }

    public async Task BroadcastNotification(string content)
    {
        var userId = _userContext.UserId;
       
        var senderId = userId;
        
        var notificationDto = new NotificationDto(senderId, content, "broadcast", DateTime.Now); 

        await Clients.All.SendAsync("ReceiveNotification", notificationDto);
    }
}

