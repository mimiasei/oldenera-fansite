using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OldenEraFanSite.Api.Models;

public class Hero
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Biography { get; set; } = string.Empty;
    
    [StringLength(300)]
    public string Summary { get; set; } = string.Empty;
    
    // Visual assets
    public string? PortraitUrl { get; set; }
    public string? FullImageUrl { get; set; }
    
    // Faction relationship
    [Required]
    public int FactionId { get; set; }
    [ForeignKey("FactionId")]
    public Faction Faction { get; set; } = null!;
    
    // Hero class and type
    [Required]
    [StringLength(50)]
    public string HeroClass { get; set; } = string.Empty; // "Knight", "Wizard", "Necromancer", etc.
    
    [StringLength(50)]
    public string HeroType { get; set; } = string.Empty; // "Might", "Magic", "Hybrid"
    
    // Starting statistics
    public int StartingAttack { get; set; } = 0;
    public int StartingDefense { get; set; } = 0;
    public int StartingSpellPower { get; set; } = 0;
    public int StartingKnowledge { get; set; } = 0;
    
    // Hero specialization
    [StringLength(100)]
    public string Specialty { get; set; } = string.Empty;
    public string? SpecialtyDescription { get; set; }
    public string? SpecialtyEffects { get; set; } // JSON for specialty mechanics
    
    // Starting skills and spells
    public string? StartingSkills { get; set; } // JSON array of starting secondary skills
    public string? StartingSpells { get; set; } // JSON array of starting spells
    public string? StartingArtifacts { get; set; } // JSON array of starting artifacts
    
    // Gameplay characteristics
    public string? PreferredTerrain { get; set; } // JSON array of preferred terrain types
    public int RarityLevel { get; set; } = 1; // 1=Common, 2=Uncommon, 3=Rare, 4=Legendary
    
    // Lore and story
    public string? Title { get; set; } // "The Brave", "Archmage", etc.
    public string? Background { get; set; } // Extended lore
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
}