namespace Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }     
    public Guid SenderId { get; set; }
    public string Content { get; set; }
    public string Type { get; set;  }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}