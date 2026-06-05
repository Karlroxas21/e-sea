using Domain.ValueObjects;
using Service.Dtos;

namespace Service.Ports;

public interface ITrainingService
{
    Task<PagedResult<TrainingResponse>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);
    Task<TrainingStatsResponse> GetTrainingStatsAsync(CancellationToken ct = default);
}