namespace Service.Dtos;

public record AuthResponse(UserResponse User, string RefreshToken);