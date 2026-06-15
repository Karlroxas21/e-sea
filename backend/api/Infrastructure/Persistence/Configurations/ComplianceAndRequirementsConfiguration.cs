using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ComplianceAndRequirementsConfiguration : IEntityTypeConfiguration<ComplianceAndRequirements>
{
    public void Configure(EntityTypeBuilder<ComplianceAndRequirements> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.DocumentName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.ExpiryDate);

        builder.Property(c => c.IsRequired)
            .IsRequired();

        builder.HasOne(c => c.User)
            .WithMany(u => u.ComplianceAndRequirements)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.DocumentType)
            .WithMany()
            .HasForeignKey(c => c.DocumentTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}