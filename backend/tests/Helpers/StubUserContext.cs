using Domain.Ports;

namespace Tests.Helpers;

/// <summary>Fixed-identity IUserContext for repository tests (no HTTP pipeline).</summary>
public sealed class StubUserContext : IUserContext
{
    public StubUserContext(Guid userId) => UserId = userId;

    public Guid UserId { get; }
}
