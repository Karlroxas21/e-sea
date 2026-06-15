namespace Domain.Entities;

public class DocumentType : Base
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }

    public static DocumentType Create(string name, string description)
    {
        return new DocumentType
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };
    }
}