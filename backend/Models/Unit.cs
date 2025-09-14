using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OldenEraFanSite.Api.Models;

public class Unit
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [StringLength(300)]
    public string Summary { get; set; } = string.Empty;
    
    // Visual assets
    public string? ImageUrl { get; set; }
    public string? PortraitUrl { get; set; }
    public string? AnimationUrl { get; set; }
    
    // Faction relationship
    [Required]
    public int FactionId { get; set; }
    [ForeignKey("FactionId")]
    public Faction? Faction { get; set; }
    
    // Unit tier and cost
    public int Tier { get; set; } = 1; // 1-7 typical for HoMM
    public int Cost { get; set; } = 0;
    public string? ResourceCosts { get; set; } // JSON for additional resource requirements
    
    // Combat statistics
    public int Attack { get; set; } = 0;
    public int Defense { get; set; } = 0;
    public int MinDamage { get; set; } = 0;
    public int MaxDamage { get; set; } = 0;
    public int Health { get; set; } = 0;
    public int Speed { get; set; } = 0;
    public int Initiative { get; set; } = 0;
    public int Morale { get; set; } = 0;
    public int Luck { get; set; } = 0;
    
    // Unit characteristics
    public string? Size { get; set; } // "Small", "Medium", "Large", "Huge"
    public string? UnitType { get; set; } // "Infantry", "Ranged", "Cavalry", "Flying", "Magic"
    public bool IsUpgraded { get; set; } = false;
    public int UpgradeLevel { get; set; } = 0; // 0 = Normal, 1 = Upgrade 1, 2 = Upgrade 2
    public int? BaseUnitId { get; set; } // Reference to base unit if this is an upgrade
    
    // Special abilities
    public string? SpecialAbilities { get; set; } // JSON array of abilities
    public string? Immunities { get; set; } // JSON array of immunities
    public string? Resistances { get; set; } // JSON array of resistances
    
    // Growth and availability
    public int WeeklyGrowth { get; set; } = 0;
    public string? BuildingRequirements { get; set; } // JSON for required buildings
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    
    // Navigation properties
    public Unit? BaseUnit { get; set; }
    public ICollection<Unit> Upgrades { get; set; } = new List<Unit>();
}