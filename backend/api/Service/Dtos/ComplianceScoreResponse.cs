using System.Text.Json.Serialization;

namespace Service.Dtos;

public record ComplianceScoreResponse(
    int Score,
    ComplianceScoreDetails Details
);

public record ComplianceScoreDetails(
    int Missing,
    [property: JsonPropertyName("expired/expiringsoon/pending")]
    int ExpiredExpiringSoonPending
);
