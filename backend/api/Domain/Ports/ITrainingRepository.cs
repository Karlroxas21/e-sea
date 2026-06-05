using Domain.Entities;
using Domain.ValueObjects;

namespace Domain.Ports;

public interface ITrainingRepository
{
    Task<PagedResult<Trainings>> GetAllAsync(int Page, int PageSize, BaseQuery query, CancellationToken ct = default);
}