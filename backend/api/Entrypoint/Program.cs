using Entrypoint.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// DB Context

// Service

// Controller
builder.Services.AddControllers();

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.MapControllers();

// await app.MigrateDbAcd
app.Run();