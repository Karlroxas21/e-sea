using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;


public class AssignmentsConfiguration : IEntityTypeConfiguration<Assignments>
{
    public void Configure(EntityTypeBuilder<Assignments> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.IsPrimaryPosition)
            .IsRequired();

        builder.Property(a => a.SignOnDate)
            .IsRequired();

        builder.Property(a => a.SignOffDate)
            .IsRequired();

        builder.Property(a => a.SignOnPort)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(a => a.SignOffPort)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(a => a.Status)
           .IsRequired();

        builder.Property(a => a.DurationDays)
            .IsRequired();

        builder.HasOne(a => a.User)
            .WithMany(u => u.Assignments)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Vessel)
            .WithMany()
            .HasForeignKey(a => a.VesselId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Position)
            .WithMany()
            .HasForeignKey(a => a.PositionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ToTable(t => t.HasCheckConstraint(
            name: "CK_Assignments_Dates",
            sql: "[SignOffDate] >= [SignOnDate]"
        ));
    }
}