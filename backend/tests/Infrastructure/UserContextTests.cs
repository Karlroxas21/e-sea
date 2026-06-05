using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Infrastructure;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace Tests.InfrastructureTests;

public class UserContextTests
{
    private static IHttpContextAccessor AccessorWith(params Claim[] claims)
    {
        var ctx = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test")),
        };
        return new HttpContextAccessor { HttpContext = ctx };
    }

    [Fact]
    public void UserId_ReturnsGuid_WhenSubClaimPresent()
    {
        var id = Guid.NewGuid();
        var sut = new UserContext(AccessorWith(new Claim(JwtRegisteredClaimNames.Sub, id.ToString())));

        Assert.Equal(id, sut.UserId);
    }

    [Fact]
    public void UserId_Throws_WhenNoHttpContext()
    {
        var sut = new UserContext(new HttpContextAccessor { HttpContext = null });

        Assert.Throws<UnauthorizedAccessException>(() => sut.UserId);
    }

    [Fact]
    public void UserId_Throws_WhenSubClaimMissing()
    {
        var sut = new UserContext(AccessorWith(new Claim("unrelated", "value")));

        Assert.Throws<UnauthorizedAccessException>(() => sut.UserId);
    }

    [Fact]
    public void UserId_Throws_WhenSubClaimNotAGuid()
    {
        var sut = new UserContext(AccessorWith(new Claim(JwtRegisteredClaimNames.Sub, "not-a-guid")));

        Assert.Throws<FormatException>(() => sut.UserId);
    }
}
