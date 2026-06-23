using Domain.ValueObjects.Filters;

namespace Domain.ValueObjects;

public record BaseQuery(
    string? Search = null,
    Sort? Sort = null,
    Order? Order = null
);