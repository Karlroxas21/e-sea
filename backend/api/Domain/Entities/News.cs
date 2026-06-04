namespace Domain.Entities;

public class News : Base
{
    public Guid Id { get; private set; }

    public string Category { get; private set; }

    public string Title { get; private set; }

    public DateOnly PublishDate { get; private set; }

    public int ReadTimeMinutes { get; private set; }

    public string ThumbnailUrl { get; private set; }

    public string ContentUrl { get; private set; }

}