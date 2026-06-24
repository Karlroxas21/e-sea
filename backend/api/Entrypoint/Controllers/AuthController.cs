using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Service.Dtos;
using Service.Ports;
namespace Entrypoint.Controllers;

[ApiController]
[Route("v1/api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, [FromServices] IValidator<LoginRequest> validator, CancellationToken ct)
    {
        await validator.ValidateAndThrowAsync(request, ct);

        var response = await _authService.Login(request.Email, request.Password, ct);

        SetRefreshTokenCookie(response.RefreshToken);
        return Ok(response.User);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken ct)
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("Refresh token is missing.");
        }

        var response = await _authService.Refresh(refreshToken, ct);

        SetRefreshTokenCookie(response.RefreshToken);
        return Ok(response.User);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegister request, [FromServices] IValidator<UserRegister> validator, CancellationToken ct)
    {
        await validator.ValidateAndThrowAsync(request, ct);
        
        await _authService.Register(request, ct);

        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");

        if (string.IsNullOrEmpty(token))
        {
            return BadRequest("Token is missing.");
        }

        await _authService.Logout(token, ct);

        Response.Cookies.Delete("refreshToken");

        return NoContent();
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

}