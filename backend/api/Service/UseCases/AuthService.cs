using System.IdentityModel.Tokens.Jwt;
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
    private readonly IBlacklistedTokenRepository _blacklistedTokenRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public AuthService(
        IUserRepository userRepository,
        IJwtProvider jwtProvider,
        IBlacklistedTokenRepository blacklistedTokenRepository,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _userRepository = userRepository;
        _jwtProvider = jwtProvider;
        _blacklistedTokenRepository = blacklistedTokenRepository;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<AuthResponse> Login(string email, string password, CancellationToken ct = default)
    {
        await _userRepository.GetUserByEmail(email, ct);

        User user = await _userRepository.Login(email, password, ct);

        string jwt = _jwtProvider.GenerateToken(user);
        string refreshToken = Guid.NewGuid().ToString();

        await _refreshTokenRepository.RemoveByUserIdAsync(user.Id, ct);
        await _refreshTokenRepository.AddAsync(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        }, ct);

        return new AuthResponse(UserResponse.ToUserResponse(user, jwt), refreshToken);
    }

    public async Task<AuthResponse> Refresh(string refreshToken, CancellationToken ct = default)
    {
        var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken, ct);

        if (token == null || token.IsExpired)
        {
            if (token != null)
            {
                await _refreshTokenRepository.RemoveAsync(token, ct);
            }
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        string jwt = _jwtProvider.GenerateToken(token.User);
        string newRefreshToken = Guid.NewGuid().ToString();

        await _refreshTokenRepository.RemoveAsync(token, ct);
        await _refreshTokenRepository.AddAsync(new RefreshToken
        {
            Token = newRefreshToken,
            UserId = token.UserId,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        }, ct);

        return new AuthResponse(UserResponse.ToUserResponse(token.User, jwt), newRefreshToken);
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

    public async Task Logout(string token, CancellationToken ct = default)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var expiresAt = jwtToken.ValidTo;

        await _blacklistedTokenRepository.AddAsync(token, expiresAt, ct);
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