using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects.Chat;
using Service.Ports;

namespace Service.UseCases;

public class ChatService(IChatRepository chatRepository, IUserRepository userRepository) : IChatService
{
    public async Task<List<ChatSummaryResponse>> GetHistorySummaryAsync(Guid myUserId, CancellationToken ct)
    {
        return await chatRepository.GetHistorySummaryAsync(myUserId, ct);
    }

    public async Task<List<ChatMessage>> GetChatMessagesAsync(Guid myUserId, Guid otherUserId, CancellationToken ct)
    {
        return await chatRepository.GetConversationAsync(myUserId, otherUserId, ct);
    }

    public async Task<ChatMessage> SendMessageAsync(Guid senderId, Guid recipientId, string content, CancellationToken ct)
    {
        var message = ChatMessage.Create(senderId, recipientId, content);
        await chatRepository.AddAsync(message, ct);
        return message;
    }

    public async Task<List<UserSearchResponse>> SearchUsersAsync(Guid myUserId, string query, CancellationToken ct)
    {
        var users = await userRepository.SearchUsersAsync(myUserId, query, ct);
        return users.Select(u => new UserSearchResponse(u.Id, u.FullName, u.Email)).ToList();
    }
}