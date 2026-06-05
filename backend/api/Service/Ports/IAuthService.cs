using Service.Dtos;

namespace Service.Ports;

public interface IAuthService
{
    Task<UserResponse> Login(string email, string password, CancellationToken ct = default);
    Task Register(UserRegister request, CancellationToken ct = default);
    Task Logout(string token, CancellationToken ct = default);
}