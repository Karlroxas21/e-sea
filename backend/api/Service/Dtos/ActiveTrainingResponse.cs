namespace Service.Dtos;

public record ActiveTrainingResponse(
    int Active,
    int Pending,
    int Scheduled
);