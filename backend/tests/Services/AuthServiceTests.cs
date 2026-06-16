using Domain.Entities;
using Domain.Exceptions;
using Domain.Ports;
using Moq;
using Service.Dtos;
using Service.UseCases;
using Tests.Helpers;
using Xunit;

namespace Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepo = new(MockBehavior.Strict);
    private readonly Mock<IJwtProvider> _jwt = new(MockBehavior.Strict);
    private readonly Mock<IBlacklistedTokenRepository> _blacklistRepo = new(MockBehavior.Strict);
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepo = new(MockBehavior.Strict);

    private AuthService CreateSut() => new(_userRepo.Object, _jwt.Object, _blacklistRepo.Object, _refreshTokenRepo.Object);

    [Fact]
    public async Task Logout_AddsTokenToBlacklist()
    {
        // To test Logout, we need a string that looks like a JWT so JwtSecurityTokenHandler can read it.
        // A simple way is to use a known valid-looking token or generate one.
        // For simplicity, I'll use a token that has the required 3 parts.
        // But since AuthService calls ReadJwtToken, it must be a valid JWT.
        
        var user = TestEntityFactory.User(Guid.NewGuid(), email: "captain@example.com", fullName: "Captain");
        var options = new Infrastructure.Jwt.JwtOptions
        {
            SecretKey = "very-secret-key-that-is-long-enough-32-chars",
            Issuer = "issuer",
            Audience = "audience",
            DurationInMinutes = 60
        };
        var jwtProvider = new Infrastructure.Jwt.JwtProvider(Microsoft.Extensions.Options.Options.Create(options));
        var token = jwtProvider.GenerateToken(user);

        _blacklistRepo.Setup(r => r.AddAsync(token, It.IsAny<DateTime>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var sut = CreateSut();

        await sut.Logout(token);

        _blacklistRepo.Verify(r => r.AddAsync(token, It.IsAny<DateTime>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Login_ReturnsUserResponseWithJwt_WhenCredentialsValid()
    {
        var userId = Guid.NewGuid();
        var user = TestEntityFactory.User(userId, email: "captain@example.com", fullName: "Captain");
        _userRepo.Setup(r => r.GetUserByEmail("captain@example.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _userRepo.Setup(r => r.Login("captain@example.com", "pw", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _jwt.Setup(j => j.GenerateToken(user)).Returns("jwt-token");
        _refreshTokenRepo.Setup(r => r.RemoveByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _refreshTokenRepo.Setup(r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var sut = CreateSut();

        var result = await sut.Login("captain@example.com", "pw");

        Assert.Equal("jwt-token", result.User.Jwt);
        Assert.NotNull(result.RefreshToken);
        Assert.Equal(userId, result.User.Id);
        Assert.Equal("captain@example.com", result.User.Email);
        Assert.Equal("Captain", result.User.FullName);
        _jwt.Verify(j => j.GenerateToken(user), Times.Once);
        _refreshTokenRepo.Verify(r => r.RemoveByUserIdAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
        _refreshTokenRepo.Verify(r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Refresh_ReturnsNewTokens_WhenRefreshTokenValid()
    {
        var userId = Guid.NewGuid();
        var user = TestEntityFactory.User(userId, email: "captain@example.com", fullName: "Captain");
        var oldToken = new RefreshToken
        {
            Token = "old-refresh-token",
            UserId = userId,
            User = user,
            ExpiresAt = DateTime.UtcNow.AddDays(1)
        };

        _refreshTokenRepo.Setup(r => r.GetByTokenAsync("old-refresh-token", It.IsAny<CancellationToken>()))
            .ReturnsAsync(oldToken);
        _jwt.Setup(j => j.GenerateToken(user)).Returns("new-jwt-token");
        _refreshTokenRepo.Setup(r => r.RemoveAsync(oldToken, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _refreshTokenRepo.Setup(r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var sut = CreateSut();

        var result = await sut.Refresh("old-refresh-token");

        Assert.Equal("new-jwt-token", result.User.Jwt);
        Assert.NotNull(result.RefreshToken);
        Assert.NotEqual("old-refresh-token", result.RefreshToken);
        _refreshTokenRepo.Verify(r => r.RemoveAsync(oldToken, It.IsAny<CancellationToken>()), Times.Once);
        _refreshTokenRepo.Verify(r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Login_PropagatesNotFound_WhenUserDoesNotExist()
    {
        _userRepo.Setup(r => r.GetUserByEmail("ghost@example.com", It.IsAny<CancellationToken>()))
            .ThrowsAsync(new NotFoundException("User ghost@example.com not found"));

        var sut = CreateSut();

        await Assert.ThrowsAsync<NotFoundException>(() => sut.Login("ghost@example.com", "pw"));
        // Token must never be generated for a missing user.
        _jwt.Verify(j => j.GenerateToken(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Login_PropagatesValidation_WhenPasswordWrong()
    {
        var user = TestEntityFactory.User(Guid.NewGuid(), email: "captain@example.com");
        _userRepo.Setup(r => r.GetUserByEmail("captain@example.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _userRepo.Setup(r => r.Login("captain@example.com", "wrong", It.IsAny<CancellationToken>()))
            .ThrowsAsync(new ValidationException("Invalid email or password"));

        var sut = CreateSut();

        await Assert.ThrowsAsync<ValidationException>(() => sut.Login("captain@example.com", "wrong"));
        _jwt.Verify(j => j.GenerateToken(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Register_HashesPassword_AndPersistsUser()
    {
        User? captured = null;
        _userRepo.Setup(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .Callback<User, CancellationToken>((u, _) => captured = u)
            .Returns(Task.CompletedTask);

        var sut = CreateSut();
        var request = new UserRegister("new@example.com", "Str0ng!Pass", "New Sailor");

        await sut.Register(request);

        Assert.NotNull(captured);
        Assert.Equal("new@example.com", captured!.Email);
        Assert.Equal("New Sailor", captured.FullName);
        // Password must be hashed, never stored as plaintext.
        Assert.NotEqual("Str0ng!Pass", captured.Password);
        Assert.True(BCrypt.Net.BCrypt.Verify("Str0ng!Pass", captured.Password));
        _userRepo.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData("Sh0rt!")]          // too short (< 8)
    [InlineData("alllower1!")]      // no uppercase
    [InlineData("ALLUPPER1!")]      // no lowercase
    [InlineData("NoDigits!!")]      // no digit
    [InlineData("NoSpecial1")]      // no special char
    [InlineData("")]                // empty
    public async Task Register_Throws_WhenPasswordViolatesPolicy(string password)
    {
        var sut = CreateSut();
        var request = new UserRegister("new@example.com", password, "New Sailor");

        await Assert.ThrowsAsync<ValidationException>(() => sut.Register(request));
        // Invalid password => never reaches the repository.
        _userRepo.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Register_PropagatesConflict_WhenUserAlreadyExists()
    {
        _userRepo.Setup(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new ConflictException("User New Sailor already exists"));

        var sut = CreateSut();
        var request = new UserRegister("new@example.com", "Str0ng!Pass", "New Sailor");

        await Assert.ThrowsAsync<ConflictException>(() => sut.Register(request));
    }
}
