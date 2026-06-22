using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Entrypoint.Hubs;

[Authorize]
public class ChatHub : Hub
{
    
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}