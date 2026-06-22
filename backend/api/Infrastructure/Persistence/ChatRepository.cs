using Domain.Entities;
using Domain.Ports;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ChatRepository(ESeaDbContext context) : IChatRepository
{
    public async Task<List<ChatSummaryResponse>> GetHistorySummaryAsync(Guid myUserId, CancellationToken ct)
    {
        var allMyMessages = await context.ChatMessages
            .Where(m => m.SenderId == myUserId || m.RecipientId == myUserId)
            .OrderByDescending(m => m.SentAt)
            .ToListAsync(ct);

        var latestMessages = allMyMessages
            .DistinctBy(m => m.SenderId == myUserId ? m.RecipientId : m.SenderId)
            .ToList();

        var otherUserIds = latestMessages
            .Select(m => m.SenderId == myUserId ? m.RecipientId : m.SenderId)
            .ToList();

        // Fetches users to attach their names
        var users = await context.Users
            .Where(u => otherUserIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Name, ct); 

        return latestMessages.Select(m => 
        {
            var otherUserId = m.SenderId == myUserId ? m.RecipientId : m.SenderId;
            var otherUserName = users.TryGetValue(otherUserId, out var name) ? name : "Unknown User";

            return new ChatSummaryResponse(
                OtherUserId: otherUserId,
                OtherUserName: otherUserName,
                LastMessage: m.Content,
                SentAt: m.SentAt
            );
        }).ToList();
    }

    public async Task<List<ChatMessage>> GetConversationAsync(Guid myUserId, Guid otherUserId, CancellationToken ct)
    {
        return await context.ChatMessages
            .Where(m => 
                (m.SenderId == myUserId && m.RecipientId == otherUserId) || 
                (m.SenderId == otherUserId && m.RecipientId == myUserId)
            )
            .OrderBy(m => m.SentAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(ChatMessage message, CancellationToken ct)
    {
        context.ChatMessages.Add(message);
        await context.SaveChangesAsync(ct);
    }
}