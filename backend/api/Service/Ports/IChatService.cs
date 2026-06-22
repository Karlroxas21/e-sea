using Domain.Entities;
using Domain.DTOs;

namespace Service.Ports;

public interface IChatService
{
    Task<List<ChatSummaryResponse>> GetHistorySummaryAsync(Guid myUserId, CancellationToken ct);
    
    Task<List<ChatMessage>> GetChatMessagesAsync(Guid myUserId, Guid otherUserId, CancellationToken ct);
    
    Task SendMessageAsync(Guid senderId, Guid recipientId, string content, CancellationToken ct);
}