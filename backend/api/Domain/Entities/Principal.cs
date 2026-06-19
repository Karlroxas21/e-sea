namespace Domain.Entities;

public class Principal : Base
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
}