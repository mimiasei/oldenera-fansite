using System.ComponentModel.DataAnnotations;

namespace OldenEraFanSite.Api.Models;

public class Faction
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string Summary { get; set; } = string.Empty;
    
    // Visual assets
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    public string? BackgroundUrl { get; set; }
    
    // Faction characteristics
    [StringLength(50)]
    public string Alignment { get; set; } = string.Empty; // e.g., "Order", "Chaos", "Neutral"
    
    [StringLength(200)]
    public string Specialty { get; set; } = string.Empty; // e.g., "Magic and Knowledge", "Warfare and Honor"
    
    // Game mechanics
    public string? StartingResources { get; set; } // JSON for resource bonuses
    public string? FactionBonuses { get; set; } // JSON for special abilities
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    
    // Navigation properties
    public ICollection<Unit> Units { get; set; } = new List<Unit>();
    public ICollection<FactionSpell> FactionSpells { get; set; } = new List<FactionSpell>();
    public ICollection<Hero> Heroes { get; set; } = new List<Hero>();
}