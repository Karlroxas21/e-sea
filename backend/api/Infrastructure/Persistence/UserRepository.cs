using Domain.Entities;
using Domain.Exceptions;
using Domain.Ports;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class UserRepository : IUserRepository
{
    private readonly ESeaDbContext _db;

    public UserRepository(ESeaDbContext db)
    {
        _db = db;
    }
    public async Task AddAsync(User user, CancellationToken ct = default)
    {
        var existing = await _db.Users.AnyAsync(u => u.DeletedAt == null && u.FullName == user.FullName);

        if (existing)
        {
            throw new ConflictException($"User {user.FullName} already exists");
        }

        await _db.Users.AddAsync(user, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<User> GetUserByEmail(string email, CancellationToken ct = default)
    {
        User user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.DeletedAt == null && u.Email == email, ct)
            ?? throw new NotFoundException($"User {email} not found"); ;

        return user;
    }
    public async Task ForgotPassword(Guid id, string newPassword, CancellationToken ct = default)
    {
        var existing = await _db.Users.FindAsync([id], ct)
         ?? throw new NotFoundException($"Id {id} not found");

        string hashed = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 12);

        existing.UpdatePassword(hashed);

        await _db.SaveChangesAsync(ct);

    }

    public async Task<User> Login(string email, string password, CancellationToken ct = default)
    {
        User user = await _db.Users
           .FirstOrDefaultAsync(u => u.Email == email && u.DeletedAt == null, ct);

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            throw new ValidationException("Invalid email or password");
        }

        return user;
    }
}