using Domain.Entities;
using Domain.ValueObjects.Chat;

namespace Domain.Ports;

public interface IChatRepository
{
    Task<List<ChatSummaryResponse>> GetHistorySummaryAsync(Guid myUserId, CancellationToken ct);
    
    Task<List<ChatMessage>> GetConversationAsync(Guid myUserId, Guid otherUserId, CancellationToken ct);
    
    Task AddAsync(ChatMessage message, CancellationToken ct);
}
