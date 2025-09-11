using System.ComponentModel.DataAnnotations;

namespace OldenEraFanSite.Api.Models;

public class MediaItem
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string MediaType { get; set; } = string.Empty; // "image", "video", "gif"
    
    // File information
    [Required]
    public string OriginalUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }        // JPEG thumbnail
    public string? ThumbnailWebpUrl { get; set; }    // WebP thumbnail
    public string? LargeUrl { get; set; }            // JPEG large version
    public string? LargeWebpUrl { get; set; }        // WebP large version
    
    [StringLength(100)]
    public string? OriginalFileName { get; set; }
    public long FileSize { get; set; } // In bytes
    public int? Width { get; set; }
    public int? Height { get; set; }
    
    // Content metadata
    public string? Tags { get; set; } // JSON array for searchable tags
    public string? AltText { get; set; }
    public string? Caption { get; set; }
    
    // Relationships
    public int CategoryId { get; set; }
    public MediaCategory Category { get; set; } = null!;
    
    // Game-specific associations (optional)
    public int? FactionId { get; set; }
    public Faction? Faction { get; set; }
    
    // User and moderation
    [StringLength(450)]
    public string? UploadedByUserId { get; set; }
    public User? UploadedByUser { get; set; }
    
    public bool IsApproved { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public int ViewCount { get; set; } = 0;
    public int SortOrder { get; set; } = 0;
}