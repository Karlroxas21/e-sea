namespace Domain.Ports;

public interface IUserContext
{
    Guid UserId { get; }
}