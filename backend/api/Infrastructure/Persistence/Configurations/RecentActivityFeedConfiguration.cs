
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class RecentActivityFeedConfiguration : IEntityTypeConfiguration<RecentActivityFeed>
{

    public void Configure(EntityTypeBuilder<RecentActivityFeed> builder)
    {
        builder.ToTable("RecentActivityFeeds");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.ActivityType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(r => r.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(r => r.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasOne(r => r.User)
            .WithMany(u => u.RecentActivityFeeds)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

}