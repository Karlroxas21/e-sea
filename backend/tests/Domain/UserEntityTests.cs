using Domain.Entities;
using Xunit;

namespace Tests.DomainTests;

public class UserEntityTests
{
    [Fact]
    public void Create_SetsProvidedFields_AndSensibleDefaults()
    {
        var user = User.Create("sailor@example.com", "hash", "Sailor Sam");

        Assert.Equal("sailor@example.com", user.Email);
        Assert.Equal("hash", user.Password);
        Assert.Equal("Sailor Sam", user.FullName);
        Assert.Equal(0, user.ComplianceScore);
        Assert.Equal("not started", user.CurrentStatus);
        Assert.NotEqual(default, user.CreatedAt);
    }

    [Fact]
    public void UpdatePassword_ReplacesPassword()
    {
        var user = User.Create("sailor@example.com", "old-hash", "Sailor Sam");

        user.UpdatePassword("new-hash");

        Assert.Equal("new-hash", user.Password);
    }
}
