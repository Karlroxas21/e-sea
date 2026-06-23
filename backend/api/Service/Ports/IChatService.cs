using Domain.Entities;
using Domain.ValueObjects.Chat;

namespace Service.Ports;

public interface IChatService
{
    Task<List<ChatSummaryResponse>> GetHistorySummaryAsync(Guid myUserId, CancellationToken ct);
    
    Task<List<ChatMessage>> GetChatMessagesAsync(Guid myUserId, Guid otherUserId, CancellationToken ct);
    
    Task<ChatMessage> SendMessageAsync(Guid senderId, Guid recipientId, string content, CancellationToken ct);

    Task<List<UserSearchResponse>> SearchUsersAsync(Guid myUserId, string query, CancellationToken ct);
}