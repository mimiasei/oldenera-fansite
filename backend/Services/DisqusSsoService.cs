using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace OldenEraFanSite.Api.Services;

public class DisqusSsoService : IDisqusSsoService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<DisqusSsoService> _logger;

    public DisqusSsoService(IConfiguration configuration, ILogger<DisqusSsoService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public string GenerateSsoToken(ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = user.FindFirst(ClaimTypes.Email)?.Value;
        var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
        var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("Cannot generate Disqus SSO token: missing userId or email");
            return string.Empty;
        }

        var username = !string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName)
            ? $"{firstName} {lastName}"
            : email.Split('@')[0]; // Use email prefix as fallback

        // Get avatar URL from claims if available
        var avatarUrl = user.FindFirst("ProfilePictureUrl")?.Value;

        return GenerateSsoPayload(userId, username, email, avatarUrl);
    }

    public string GenerateSsoPayload(string userId, string username, string email, string? avatarUrl = null)
    {
        var disqusSecretKey = _configuration["DISQUS_SECRET_KEY"];
        if (string.IsNullOrEmpty(disqusSecretKey))
        {
            _logger.LogError("DISQUS_SECRET_KEY not configured");
            return string.Empty;
        }

        try
        {
            // Create user data payload
            var userData = new
            {
                id = userId,
                username = username,
                email = email,
                avatar = avatarUrl,
                url = $"{_configuration["JWT_AUDIENCE"]}/profile" // Link to user profile
            };

            var userDataJson = JsonSerializer.Serialize(userData);
            var userDataBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(userDataJson));

            // Generate timestamp
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            // Create message for HMAC signing
            var message = $"{userDataBase64} {timestamp}";

            // Generate HMAC-SHA1 signature
            using var hmac = new HMACSHA1(Encoding.UTF8.GetBytes(disqusSecretKey));
            var signatureBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
            var signature = Convert.ToHexString(signatureBytes).ToLowerInvariant();

            // Return the complete SSO payload
            return $"{userDataBase64} {signature} {timestamp}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating Disqus SSO payload");
            return string.Empty;
        }
    }
}