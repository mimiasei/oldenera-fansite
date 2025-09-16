using System.Security.Claims;

namespace OldenEraFanSite.Api.Services;

public interface IDisqusSsoService
{
    string GenerateSsoToken(ClaimsPrincipal user);
    string GenerateSsoPayload(string userId, string username, string email, string? avatarUrl = null);
}