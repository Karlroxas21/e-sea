using Domain.Entities;

namespace Domain.Ports;

public interface IJwtProvider { string GenerateToken(User user); }