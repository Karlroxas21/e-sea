using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AssignmentRequirementConfiguration : IEntityTypeConfiguration<AssignmentRequirement>
{
    public void Configure(EntityTypeBuilder<AssignmentRequirement> builder)
    {
        builder.HasKey(ar => new { ar.AssignmentId, ar.DocumentTypeId });

        builder.HasOne(ar => ar.Assignment)
            .WithMany(a => a.Requirements)
            .HasForeignKey(ar => ar.AssignmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ar => ar.DocumentType)
            .WithMany()
            .HasForeignKey(ar => ar.DocumentTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}