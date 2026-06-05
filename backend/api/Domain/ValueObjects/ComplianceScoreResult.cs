namespace Domain.ValueObjects;

public record ComplianceScoreResult(
    int Score,
    int MissingCount,
    int ExpiredExpiringSoonPendingCount
);
