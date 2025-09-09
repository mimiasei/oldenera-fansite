using Microsoft.IdentityModel.Tokens;
using OldenEraFanSite.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OldenEraFanSite.Api.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<JwtService> _logger;

    public JwtService(IConfiguration configuration, ILogger<JwtService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public string GenerateToken(User user, IList<string> roles)
    {
        // Use environment variables first, then configuration
        var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
            ?? _configuration["JWT:SecretKey"] 
            ?? throw new InvalidOperationException("JWT_SECRET_KEY not found in environment variables or configuration");
        
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
            ?? _configuration["JWT:Issuer"]
            ?? throw new InvalidOperationException("JWT_ISSUER not found in environment variables or configuration");
        
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
            ?? _configuration["JWT:Audience"]
            ?? throw new InvalidOperationException("JWT_AUDIENCE not found in environment variables or configuration");
        
        var expiryInMinutes = int.Parse(_configuration["JWT:ExpiryInMinutes"] ?? "60");

        // Clean any potential whitespace from the key
        jwtSecretKey = jwtSecretKey.Replace("\n", "").Replace("\r", "").Replace(" ", "").Replace("\t", "").Trim();
        
        if (jwtSecretKey.Length < 32)
        {
            throw new InvalidOperationException($"JWT SecretKey too short: {jwtSecretKey.Length} characters");
        }

        var secretKey = Encoding.UTF8.GetBytes(jwtSecretKey);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Email, user.Email!),
            new("firstName", user.FirstName ?? ""),
            new("lastName", user.LastName ?? ""),
            new("displayName", user.DisplayName),
            new("profilePicture", user.ProfilePictureUrl ?? ""),
            new("isActive", user.IsActive.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        // Add role claims
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryInMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(secretKey),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public bool ValidateToken(string token)
    {
        try
        {
            GetPrincipalFromToken(token);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Token validation failed");
            return false;
        }
    }

    public ClaimsPrincipal GetPrincipalFromToken(string token)
    {
        // Use environment variables first, then configuration
        var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
            ?? _configuration["JWT:SecretKey"] 
            ?? throw new InvalidOperationException("JWT_SECRET_KEY not found in environment variables or configuration");
        
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
            ?? _configuration["JWT:Issuer"]
            ?? throw new InvalidOperationException("JWT_ISSUER not found in environment variables or configuration");
        
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
            ?? _configuration["JWT:Audience"]
            ?? throw new InvalidOperationException("JWT_AUDIENCE not found in environment variables or configuration");

        // Clean any potential whitespace from the key
        jwtSecretKey = jwtSecretKey.Replace("\n", "").Replace("\r", "").Replace(" ", "").Replace("\t", "").Trim();
        
        var secretKey = Encoding.UTF8.GetBytes(jwtSecretKey);

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
    }

    public DateTime GetTokenExpiration(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jsonToken = tokenHandler.ReadJwtToken(token);
        return jsonToken.ValidTo;
    }
}