using Microsoft.AspNetCore.Identity;

namespace OldenEraFanSite.Api.Models;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    
    // Google OAuth fields (ready for future implementation)
    public string? GoogleId { get; set; }
    public string? GoogleRefreshToken { get; set; }
    
    // Additional user properties
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Computed properties
    public string FullName => !string.IsNullOrEmpty(FirstName) && !string.IsNullOrEmpty(LastName) 
        ? $"{FirstName} {LastName}" 
        : UserName ?? Email ?? "User";
    
    public string DisplayName => !string.IsNullOrEmpty(FirstName) 
        ? FirstName 
        : UserName ?? Email ?? "User";
}