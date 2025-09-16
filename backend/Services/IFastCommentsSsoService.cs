using System.Security.Claims;
using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Services;

public interface IFastCommentsSsoService
{
    FastCommentsSsoToken GenerateSsoToken(ClaimsPrincipal user);
    FastCommentsSsoToken GenerateSsoPayload(string userId, string username, string email, string? avatarUrl = null);
}