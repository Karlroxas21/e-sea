using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Entrypoint.Middlewares;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var (status, title) = ex switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "Not Found"),
            ConflictException => (StatusCodes.Status409Conflict, "Conflict"),
            Domain.Exceptions.ValidationException => (StatusCodes.Status422UnprocessableEntity, "Validation Error"),
            FluentValidation.ValidationException => (StatusCodes.Status422UnprocessableEntity, "Validation Error"),
            _ => (StatusCodes.Status500InternalServerError, "Internal Server Error"),
        };

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = ex.Message,
        };

        if (ex is FluentValidation.ValidationException fvEx)
        {
            problem.Extensions["errors"] = fvEx.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );
        }

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem);
    }
}

