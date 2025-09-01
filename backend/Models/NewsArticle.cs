using System.ComponentModel.DataAnnotations;

namespace OldenEraFanSite.Api.Models;

public class NewsArticle
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string Summary { get; set; } = string.Empty;
    
    public DateTime PublishedAt { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }
    
    public bool IsPublished { get; set; }
    
    [StringLength(100)]
    public string Author { get; set; } = "Admin";
    
    public string? ImageUrl { get; set; }
    
    public List<string> Tags { get; set; } = new();
}