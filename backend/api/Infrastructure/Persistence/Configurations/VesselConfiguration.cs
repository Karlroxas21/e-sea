using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;


public class VesselConfiguration : IEntityTypeConfiguration<Vessles>
{
    public void Configure(EntityTypeBuilder<Vessles> builder)
    {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(v => v.Type)
                   .IsRequired()
                   .HasMaxLength(50);
    }
}