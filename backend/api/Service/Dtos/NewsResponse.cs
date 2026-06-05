using Domain.Entities;

namespace Service.Dtos;

public record NewsResponse(
    Guid Id,
    string Category,
    string Title,
    DateOnly PublishDate,
    int ReadTimeMinutes,
    string ThumbnailUrl,
    string ContentUrl
)
{
    public static NewsResponse FromEntity(News news)
    {
        return new NewsResponse(
            news.Id,
            news.Category,
            news.Title,
            news.PublishDate,
            news.ReadTimeMinutes,
            news.ThumbnailUrl,
            news.ContentUrl
        );
    }
}
