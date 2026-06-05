using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Persistence;
using Tests.Helpers;
using Xunit;

namespace Tests.Repositories;

public class UserRepositoryTests
{
    private static User HashedUser(string email, string plaintextPassword, string fullName)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(plaintextPassword, workFactor: 12);
        return User.Create(email, hash, fullName);
    }

    [Fact]
    public async Task AddAsync_PersistsUser_WhenNew()
    {
        using var db = TestDbContextFactory.Create();
        var repo = new UserRepository(db);
        var user = User.Create("new@example.com", "hash", "Brand New");

        await repo.AddAsync(user);

        Assert.Equal(1, db.Users.Count());
    }

    [Fact]
    public async Task AddAsync_ThrowsConflict_WhenFullNameAlreadyExists()
    {
        using var db = TestDbContextFactory.Create();
        db.Users.Add(User.Create("a@example.com", "hash", "Duplicate Name"));
        await db.SaveChangesAsync();
        var repo = new UserRepository(db);

        var dup = User.Create("b@example.com", "hash", "Duplicate Name");

        await Assert.ThrowsAsync<ConflictException>(() => repo.AddAsync(dup));
    }

    [Fact]
    public async Task GetUserByEmail_ReturnsUser_WhenExists()
    {
        using var db = TestDbContextFactory.Create();
        db.Users.Add(User.Create("found@example.com", "hash", "Found"));
        await db.SaveChangesAsync();
        var repo = new UserRepository(db);

        var user = await repo.GetUserByEmail("found@example.com");

        Assert.Equal("found@example.com", user.Email);
    }

    [Fact]
    public async Task GetUserByEmail_ThrowsNotFound_WhenMissing()
    {
        using var db = TestDbContextFactory.Create();
        var repo = new UserRepository(db);

        await Assert.ThrowsAsync<NotFoundException>(() => repo.GetUserByEmail("ghost@example.com"));
    }

    [Fact]
    public async Task GetUserByEmail_ThrowsNotFound_WhenSoftDeleted()
    {
        using var db = TestDbContextFactory.Create();
        var user = User.Create("gone@example.com", "hash", "Gone");
        user.DeletedAt = DateTime.UtcNow;
        db.Users.Add(user);
        await db.SaveChangesAsync();
        var repo = new UserRepository(db);

        await Assert.ThrowsAsync<NotFoundException>(() => repo.GetUserByEmail("gone@example.com"));
    }

    [Fact]
    public async Task Login_ReturnsUser_WhenCredentialsValid()
    {
        using var db = TestDbContextFactory.Create();
        db.Users.Add(HashedUser("login@example.com", "Str0ng!Pass", "Login User"));
        await db.SaveChangesAsync();
        var repo = new UserRepository(db);

        var user = await repo.Login("login@example.com", "Str0ng!Pass");

        Assert.Equal("login@example.com", user.Email);
    }

    [Fact]
    public async Task Login_ThrowsValidation_WhenPasswordWrong()
    {
        using var db = TestDbContextFactory.Create();
        db.Users.Add(HashedUser("login@example.com", "Str0ng!Pass", "Login User"));
        await db.SaveChangesAsync();
        var repo = new UserRepository(db);

        await Assert.ThrowsAsync<ValidationException>(() => repo.Login("login@example.com", "WrongPass!1"));
    }

    [Fact]
    public async Task Login_ThrowsValidation_WhenEmailNotFound()
    {
        using var db = TestDbContextFactory.Create();
        var repo = new UserRepository(db);

        await Assert.ThrowsAsync<ValidationException>(() => repo.Login("nobody@example.com", "whatever"));
    }

    [Fact]
    public async Task ForgotPassword_UpdatesPasswordHash()
    {
        using var db = TestDbContextFactory.Create();
        var user = HashedUser("reset@example.com", "OldPass!1", "Reset User");
        db.Users.Add(user);
        await db.SaveChangesAsync();
        var repo = new UserRepository(db);

        await repo.ForgotPassword(user.Id, "NewPass!1");

        var updated = await db.Users.FindAsync(user.Id);
        Assert.NotNull(updated);
        Assert.True(BCrypt.Net.BCrypt.Verify("NewPass!1", updated!.Password));
        Assert.False(BCrypt.Net.BCrypt.Verify("OldPass!1", updated.Password));
    }

    [Fact]
    public async Task ForgotPassword_ThrowsNotFound_WhenUserMissing()
    {
        using var db = TestDbContextFactory.Create();
        var repo = new UserRepository(db);

        await Assert.ThrowsAsync<NotFoundException>(() => repo.ForgotPassword(Guid.NewGuid(), "NewPass!1"));
    }
}
