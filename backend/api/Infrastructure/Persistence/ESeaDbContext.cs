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
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Assignments> Assignments => Set<Assignments>();
    public DbSet<Principal> Principals => Set<Principal>();
    public DbSet<Vessles> Vessels => Set<Vessles>();
    public DbSet<Positions> Positions => Set<Positions>();
    public DbSet<DocumentType> DocumentTypes => Set<DocumentType>();
    public DbSet<VesselRequirement> VesselRequirements => Set<VesselRequirement>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ESeaDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

}