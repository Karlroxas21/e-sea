using Domain.Entities;

namespace Service.Dtos;

public record TrainingResponse(
    Guid Id,
    string Title,
    string ProviderOrLocation,
    string Status,
    DateTime ScheduleDate,
    Guid UserId
)
{
    public static TrainingResponse FromEntity(Trainings training)
    {
        return new TrainingResponse(
            training.Id,
            training.Title,
            training.ProviderOrLocation,
            training.Status,
            training.ScheduleDate,
            training.UserId
        );
    }
}
