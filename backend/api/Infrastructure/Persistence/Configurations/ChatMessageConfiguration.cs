using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.HasKey(c => c.Id); 
        
        builder.Property(c => c.SenderId).IsRequired();
        builder.Property(c => c.RecipientId).IsRequired();
        builder.Property(c => c.Content).IsRequired();
        builder.Property(c => c.SentAt).IsRequired();
    }
}