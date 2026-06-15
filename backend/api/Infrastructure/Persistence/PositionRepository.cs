using Domain.Entities;
using Domain.Ports;
using Domain.ValueObjects;

namespace Infrastructure.Persistence;

public class PositionRepository : IPositionRepository
{
    private readonly ESeaDbContext _context;

    public PositionRepository(ESeaDbContext context)
    {
        _context = context;
    }

    public Task<PagedResult<Positions>> GetAllAsync(int Page, int PageSize, BaseQuery? query, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}
