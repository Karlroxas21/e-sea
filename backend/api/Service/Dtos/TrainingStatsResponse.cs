namespace Service.Dtos;

public record TrainingStatsResponse(
    int Completed,
    int Pending,
    int Scheduled
);
