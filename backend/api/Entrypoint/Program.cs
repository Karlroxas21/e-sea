using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Domain.Ports;
using Entrypoint.Middlewares;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.IdentityModel.Tokens;
using Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Infra
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var blacklistedTokenRepository = context.HttpContext.RequestServices.GetRequiredService<IBlacklistedTokenRepository>();
                var token = context.SecurityToken as JwtSecurityToken;

                if (token != null && await blacklistedTokenRepository.IsBlacklistedAsync(token.RawData, context.HttpContext.RequestAborted))
                {
                    context.Fail("This token is blacklisted.");
                }
            }
        };
    });
builder.Services.AddAuthorization();

// DB Context
builder.Services.AddInfrastructure(builder.Configuration);

// Service
builder.Services.AddService();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Controller
builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.MigrateDbAsync();
app.Run();