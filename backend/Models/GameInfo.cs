using System.ComponentModel.DataAnnotations;

namespace OldenEraFanSite.Api.Models;

// General game information and content pages
public class GameInfo
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    [StringLength(300)]
    public string Summary { get; set; } = string.Empty;
    
    // Page categorization
    [Required]
    [StringLength(50)]
    public string Category { get; set; } = string.Empty; // "Gameplay", "Story", "Features", "System"
    
    [StringLength(100)]
    public string Slug { get; set; } = string.Empty; // URL-friendly identifier
    
    // Visual assets
    public string? BannerUrl { get; set; }
    public string? IconUrl { get; set; }
    public List<string> ImageUrls { get; set; } = new(); // Additional images for the content
    
    // Content organization
    public int SortOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    
    // SEO and metadata
    public string? MetaDescription { get; set; }
    public List<string> Tags { get; set; } = new();
    
    // Content relationships
    public List<int> RelatedFactionIds { get; set; } = new(); // Related factions
    public List<int> RelatedGameInfoIds { get; set; } = new(); // Related game info pages
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    [StringLength(100)]
    public string Author { get; set; } = "Admin";
}