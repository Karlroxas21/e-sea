using Domain.Entities;

namespace Domain.Ports;

public interface INotificationRepository
{
    Task<Notification> SaveAsync(Notification notification, CancellationToken ct);
}