using Domain.Ports;

namespace Infrastructure.Persistence;

public class VesselsRepository : IVesselsRepository
{
    private readonly ESeaDbContext _db;

    public VesselsRepository(ESeaDbContext db, IUserContext userContext)
    {
        _db = db;
    }

}