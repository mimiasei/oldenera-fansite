using System.ComponentModel.DataAnnotations;

namespace OldenEraFanSite.Api.Models;

public class MediaCategory
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Slug { get; set; } = string.Empty;
    
    // Visual representation
    public string? IconUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    
    // Category properties
    [StringLength(7)]
    public string Color { get; set; } = "#3B82F6"; // Hex color for UI theming
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    
    // Navigation properties
    public ICollection<MediaItem> MediaItems { get; set; } = new List<MediaItem>();
}