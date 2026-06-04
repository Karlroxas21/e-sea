using Domain.Entities;
using Domain.Ports;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtProvider _jwtProvider;

    public AuthService(IUserRepository userRepository, IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _jwtProvider = jwtProvider;
    }

    public async Task<UserResponse> Login(string email, string password, CancellationToken ct = default)
    {
        await _userRepository.GetUserByEmail(email, ct);

        User user = await _userRepository.Login(email, password, ct);

        string jwt = _jwtProvider.GenerateToken(user);

        return UserResponse.ToUserResponse(user, jwt);
    }

    public async Task Register(UserRegister request, CancellationToken ct = default)
    {
        string hashedPw = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

        var user = User.Create(
            request.Email,
            hashedPw,
            request.FullName
        );

        await _userRepository.AddAsync(user, ct);
    }
}