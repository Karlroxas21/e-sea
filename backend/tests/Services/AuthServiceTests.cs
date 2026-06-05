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

    private AuthService CreateSut() => new(_userRepo.Object, _jwt.Object);

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

        var sut = CreateSut();

        var result = await sut.Login("captain@example.com", "pw");

        Assert.Equal("jwt-token", result.Jwt);
        Assert.Equal(userId, result.Id);
        Assert.Equal("captain@example.com", result.Email);
        Assert.Equal("Captain", result.FullName);
        _jwt.Verify(j => j.GenerateToken(user), Times.Once);
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
