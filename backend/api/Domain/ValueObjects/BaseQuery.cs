using Domain.ValueObjects.Filters;

namespace Domain.ValueObjects;

public record BaseQuery(
    Sort? Sort = null,
    Order? Order = null
);