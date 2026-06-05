using Domain.Entities;

namespace Domain.Ports;

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken ct = default);
    Task<User> GetUserByEmail(string email, CancellationToken ct = default);
    Task<User> Login(string email, string password, CancellationToken ct = default);
    Task ForgotPassword(Guid id, string newPassword, CancellationToken ct = default);
}