using Microsoft.Extensions.DependencyInjection;
using Service.Ports;
using Service.UseCases;

namespace Service;

public static class DependencyInjection
{
    public static IServiceCollection AddService(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IComplianceAndRequirementsService, ComplianceAndRequirementsService>();
        services.AddScoped<INewsService, NewsService>();
        services.AddScoped<IRecentActivityFeedService, RecentActivityFeedService>();
        services.AddScoped<ITrainingService, TrainingService>();
        services.AddScoped<IAssignmentService, AssignmentService>();
        services.AddScoped<IVesselService, VesselService>();
        services.AddScoped<IPrincipalService, PrincipalService>();
        
        return services;
    }
}