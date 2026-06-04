
namespace Service.Dtos;

public record UserRegister(
    string Email,
    string Password,
    string FullName
);