using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class NewsConfiguration : IEntityTypeConfiguration<News>
{
    public void Configure(EntityTypeBuilder<News> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Category)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(n => n.Title)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(n => n.PublishDate)
            .IsRequired();

        builder.Property(n => n.ReadTimeMinutes)
            .IsRequired();

        builder.Property(n => n.ThumbnailUrl)
            .IsRequired()
            .HasMaxLength(2048);

        builder.Property(n => n.ContentUrl)
            .IsRequired()
            .HasMaxLength(2048);
    }
}