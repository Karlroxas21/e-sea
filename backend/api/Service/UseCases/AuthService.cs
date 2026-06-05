using Domain.Entities;
using Domain.Exceptions;
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
        ValidatePassword(request.Password);

        string hashedPw = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

        var user = User.Create(
            request.Email,
            hashedPw,
            request.FullName
        );

        await _userRepository.AddAsync(user, ct);
    }

    private static void ValidatePassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
        {
            throw new ValidationException("Password must be at least 8 characters long.");
        }

        if (!password.Any(char.IsUpper))
        {
            throw new ValidationException("Password must contain at least one uppercase letter.");
        }

        if (!password.Any(char.IsLower))
        {
            throw new ValidationException("Password must contain at least one lowercase letter.");
        }

        if (!password.Any(char.IsDigit))
        {
            throw new ValidationException("Password must contain at least one digit.");
        }

        if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
        {
            throw new ValidationException("Password must contain at least one special character.");
        }
    }
}