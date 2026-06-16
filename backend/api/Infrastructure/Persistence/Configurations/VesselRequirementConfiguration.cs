using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class VesselRequirementConfiguration : IEntityTypeConfiguration<VesselRequirement>
{
    public void Configure(EntityTypeBuilder<VesselRequirement> builder)
    {
        builder.HasKey(vr => new { vr.VesselId, vr.DocumentTypeId });

        builder.HasOne(vr => vr.Vessel)
            .WithMany(v => v.VesselRequirements)
            .HasForeignKey(vr => vr.VesselId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(vr => vr.DocumentType)
            .WithMany()
            .HasForeignKey(vr => vr.DocumentTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}