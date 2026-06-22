using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Entrypoint.Hubs;

[Authorize]
public class ChatHub : Hub
{
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
}