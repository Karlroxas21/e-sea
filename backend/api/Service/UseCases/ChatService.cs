using Domain.Entities;
using Domain.Ports;
using Service.Ports;
using Domain.DTOs;

namespace Service.UseCases;

public class ChatService(IChatRepository chatRepository) : IChatService
{
    public async Task<List<Domain.Ports.ChatSummaryResponse>> GetHistorySummaryAsync(Guid myUserId, CancellationToken ct)
    {
        return await chatRepository.GetHistorySummaryAsync(myUserId, ct);
    }

    public async Task<List<ChatMessage>> GetChatMessagesAsync(Guid myUserId, Guid otherUserId, CancellationToken ct)
    {
        return await chatRepository.GetConversationAsync(myUserId, otherUserId, ct);
    }

    public async Task SendMessageAsync(Guid senderId, Guid recipientId, string content, CancellationToken ct)
    {
        var message = ChatMessage.Create(senderId, recipientId, content);
        await chatRepository.AddAsync(message, ct);
    }

    Task<List<Domain.DTOs.ChatSummaryResponse>> IChatService.GetHistorySummaryAsync(Guid myUserId, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}