using OldenEraFanSite.Api.Models;
using System.Security.Claims;

namespace OldenEraFanSite.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user, IList<string> roles);
    bool ValidateToken(string token);
    ClaimsPrincipal GetPrincipalFromToken(string token);
    DateTime GetTokenExpiration(string token);
}