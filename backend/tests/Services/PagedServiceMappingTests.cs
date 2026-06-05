using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Moq;
using Service.UseCases;
using Tests.Helpers;
using Xunit;

namespace Tests.Services;

/// <summary>
/// The read services are thin: delegate to the repo, map entities to response DTOs,
/// and preserve paging metadata. These tests pin that contract.
/// </summary>
public class PagedServiceMappingTests
{
    private static readonly BaseQuery Query = new();

    [Fact]
    public async Task NewsService_MapsEntities_AndPreservesPaging()
    {
        var entity = TestEntityFactory.News(title: "Storm warning", category: "Weather");
        var repo = new Mock<INewsRepository>();
        repo.Setup(r => r.GetAllAsync(2, 5, Query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PagedResult<News>(new[] { entity }, 2, 5, 11));

        var sut = new NewsService(repo.Object);

        var result = await sut.GetAllAsync(2, 5, Query);

        Assert.Equal(2, result.Page);
        Assert.Equal(5, result.PageSize);
        Assert.Equal(11, result.TotalCount);
        Assert.Equal(3, result.TotalPages);
        var item = Assert.Single(result.Items);
        Assert.Equal(entity.Id, item.Id);
        Assert.Equal("Storm warning", item.Title);
        Assert.Equal("Weather", item.Category);
    }

    [Fact]
    public async Task ComplianceService_MapsEntities_AndPreservesPaging()
    {
        var userId = Guid.NewGuid();
        var entity = TestEntityFactory.Compliance(userId, documentName: "Seaman Book", status: "expired");
        var repo = new Mock<IComplianceAndRequirementsRepository>();
        repo.Setup(r => r.GetAllAsync(1, 10, Query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PagedResult<ComplianceAndRequirements>(new[] { entity }, 1, 10, 1));

        var sut = new ComplianceAndRequirementsService(repo.Object);

        var result = await sut.GetAllAsync(1, 10, Query);

        var item = Assert.Single(result.Items);
        Assert.Equal("Seaman Book", item.DocumentName);
        Assert.Equal("expired", item.Status);
        Assert.Equal(userId, item.UserId);
    }

    [Fact]
    public async Task TrainingService_MapsEntities_AndPreservesPaging()
    {
        var userId = Guid.NewGuid();
        var entity = TestEntityFactory.Training(userId, title: "GMDSS", status: "completed");
        var repo = new Mock<ITrainingRepository>();
        repo.Setup(r => r.GetAllAsync(1, 10, Query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PagedResult<Trainings>(new[] { entity }, 1, 10, 1));

        var sut = new TrainingService(repo.Object);

        var result = await sut.GetAllAsync(1, 10, Query);

        var item = Assert.Single(result.Items);
        Assert.Equal("GMDSS", item.Title);
        Assert.Equal("completed", item.Status);
        Assert.Equal(userId, item.UserId);
    }

    [Fact]
    public async Task RecentActivityService_MapsEntities_AndPreservesPaging()
    {
        var userId = Guid.NewGuid();
        var entity = TestEntityFactory.Activity(userId, title: "Cert uploaded", activityType: "upload");
        var repo = new Mock<IRecentActivityRepository>();
        repo.Setup(r => r.GetAllAsync(1, 10, Query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PagedResult<RecentActivityFeed>(new[] { entity }, 1, 10, 1));

        var sut = new RecentActivityFeedService(repo.Object);

        var result = await sut.GetAllAsync(1, 10, Query);

        var item = Assert.Single(result.Items);
        Assert.Equal("Cert uploaded", item.Title);
        Assert.Equal("upload", item.ActivityType);
        Assert.Equal(userId, item.UserId);
    }

    [Fact]
    public async Task Service_ReturnsEmptyResult_WhenRepoEmpty()
    {
        var repo = new Mock<INewsRepository>();
        repo.Setup(r => r.GetAllAsync(1, 10, Query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PagedResult<News>(Array.Empty<News>(), 1, 10, 0));

        var sut = new NewsService(repo.Object);

        var result = await sut.GetAllAsync(1, 10, Query);

        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
        Assert.Equal(0, result.TotalPages);
        Assert.False(result.HasNext);
        Assert.False(result.HasPrevious);
    }
}
