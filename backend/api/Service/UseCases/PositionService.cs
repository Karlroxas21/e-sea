using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;
using Service.Ports;

namespace Service.UseCases;

public class PositionService : IPositionService
{
    private readonly IPositionRepository _repository;

    public PositionService(IPositionRepository repository) => _repository = repository;

    public async Task<PagedResult<Positions>> GetAllAsync(int Page, int PageSize, BaseQuery? query, CancellationToken ct) 
        => await _repository.GetAllAsync(Page, PageSize, query, ct);
}