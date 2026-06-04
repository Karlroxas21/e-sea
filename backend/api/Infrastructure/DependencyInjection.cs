using Domain.Ports;
using Infrastructure.Jwt;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ESeaDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("Default")));

        // JWT
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.AddScoped<IJwtProvider, JwtProvider>();    

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }

    public static async Task MigrateDbAsync(this IHost app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ESeaDbContext>();

        dbContext.Database.Migrate();
    }
}