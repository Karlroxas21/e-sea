using Domain.Ports;
using Domain.ValueObjects;
using Service.Dtos;
using Service.Ports;

namespace Service.UseCases;

public class TrainingService : ITrainingService
{
    private readonly ITrainingRepository _trainingRepository;
    private readonly IUserContext _userContext;

    public TrainingService(ITrainingRepository trainingRepository, IUserContext userContext)
    {
        _trainingRepository = trainingRepository;
        _userContext = userContext;
    }

    public async Task<PagedResult<TrainingResponse>> GetAllAsync(int page, int pageSize, BaseQuery query, CancellationToken ct = default)
    {
        var pageRes = await _trainingRepository.GetAllAsync(page, pageSize, query, ct);

        var items = pageRes.Items.Select(TrainingResponse.FromEntity).ToList();

        return new PagedResult<TrainingResponse>(items, pageRes.Page, pageRes.PageSize, pageRes.TotalCount);
    }

    public async Task<TrainingStatsResponse> GetTrainingStatsAsync(CancellationToken ct = default)
    {
        var (completed, pending, scheduled) = await _trainingRepository.GetTrainingStats(_userContext.UserId, ct);
        return new TrainingStatsResponse(completed, pending, scheduled);
    }
}
