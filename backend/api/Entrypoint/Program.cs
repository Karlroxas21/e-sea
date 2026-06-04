using Entrypoint.Middlewares;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// DB Context
builder.Services.AddInfrastructure(builder.Configuration);

// Service

// Controller
builder.Services.AddControllers();

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.MapControllers();

await app.MigrateDbAsync();
app.Run();