using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Services;

public class FastCommentsSsoService : IFastCommentsSsoService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<FastCommentsSsoService> _logger;

    public FastCommentsSsoService(IConfiguration configuration, ILogger<FastCommentsSsoService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public FastCommentsSsoToken GenerateSsoToken(ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = user.FindFirst(ClaimTypes.Email)?.Value;
        var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
        var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("Cannot generate FastComments SSO token: missing userId or email");
            return new FastCommentsSsoToken();
        }

        // FastComments requirement: username cannot be an email
        var username = !string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName)
            ? $"{firstName} {lastName}"
            : email.Split('@')[0]; // Use email prefix to ensure it's not an email format

        // Get avatar URL from claims if available
        var avatarUrl = user.FindFirst("ProfilePictureUrl")?.Value;

        return GenerateSsoPayload(userId, username, email, avatarUrl);
    }

    public FastCommentsSsoToken GenerateSsoPayload(string userId, string username, string email, string? avatarUrl = null)
    {
        var fastCommentsSecretKey = _configuration["FASTCOMMENTS_SECRET_KEY"];
        if (string.IsNullOrEmpty(fastCommentsSecretKey))
        {
            _logger.LogError("FASTCOMMENTS_SECRET_KEY not configured");
            return new FastCommentsSsoToken();
        }

        try
        {
            var baseUrl = _configuration["JWT_AUDIENCE"];

            // Create user data payload (FastComments format)
            var userData = new
            {
                id = userId,
                username = username,
                email = email,
                avatar = avatarUrl
            };

            // Use compact JSON serialization (no spaces)
            var jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = false,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var userDataJson = JsonSerializer.Serialize(userData, jsonOptions);
            var userDataBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(userDataJson));

            // Generate timestamp in MILLISECONDS (Unix timestamp) - FastComments current spec uses milliseconds
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            // FastComments HMAC: Hash ONLY the userDataJSONBase64 field (not timestamp + userDataBase64)
            // Per TypeScript docs: "The HMAC-SHA256 hash of the userDataJSONBase64 field, using your secret key"

            // Debug logging
            _logger.LogInformation("FastComments SSO Debug - UserDataJSON: {UserDataJson}", userDataJson);
            _logger.LogInformation("FastComments SSO Debug - UserDataBase64: {UserDataBase64}", userDataBase64);
            _logger.LogInformation("FastComments SSO Debug - Timestamp: {Timestamp}", timestamp);

            // Generate HMAC-SHA256 signature of ONLY the userDataBase64 (not timestamp + userDataBase64)
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(fastCommentsSecretKey));
            var signatureBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDataBase64));
            var signature = Convert.ToHexString(signatureBytes).ToLowerInvariant();

            _logger.LogInformation("FastComments SSO Debug - Signature: {Signature}", signature);

            return new FastCommentsSsoToken
            {
                UserDataJSONBase64 = userDataBase64,
                VerificationHash = signature,
                Timestamp = timestamp,
                LoginURL = $"{baseUrl}/login",
                LogoutURL = $"{baseUrl}/logout"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating FastComments SSO payload");
            return new FastCommentsSsoToken();
        }
    }
}