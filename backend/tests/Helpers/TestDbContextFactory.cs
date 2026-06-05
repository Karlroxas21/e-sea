using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Tests.Helpers;

/// <summary>Builds an isolated EF Core InMemory ESeaDbContext per test.</summary>
public static class TestDbContextFactory
{
    public static ESeaDbContext Create()
    {
        var options = new DbContextOptionsBuilder<ESeaDbContext>()
            // Unique name per call => fully isolated store per test.
            .UseInMemoryDatabase($"esea-tests-{Guid.NewGuid()}")
            .EnableSensitiveDataLogging()
            .Options;

        return new ESeaDbContext(options);
    }
}
