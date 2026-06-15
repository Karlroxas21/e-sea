using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ESeaDbContext(DbContextOptions<ESeaDbContext> options) : DbContext(options)
{
    public DbSet<ComplianceAndRequirements> ComplianceAndRequirements => Set<ComplianceAndRequirements>();
    public DbSet<News> News => Set<News>();
    public DbSet<RecentActivityFeed> RecentActivityFeeds => Set<RecentActivityFeed>();
    public DbSet<Trainings> Trainings => Set<Trainings>();
    public DbSet<User> Users => Set<User>();
    public DbSet<BlacklistedToken> BlacklistedTokens => Set<BlacklistedToken>();
    public DbSet<Assignments> Assignments => Set<Assignments>();
    public DbSet<Vessles> Vessels => Set<Vessles>();
    public DbSet<Positions> Positions => Set<Positions>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ESeaDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

}