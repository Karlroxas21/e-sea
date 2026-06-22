namespace Domain.Entities;

public class Base
{
    public Guid Id { get; protected set; }
    
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

}
