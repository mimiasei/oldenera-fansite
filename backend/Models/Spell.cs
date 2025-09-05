using System.ComponentModel.DataAnnotations;

namespace OldenEraFanSite.Api.Models;

public class Spell
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
    public string? IconUrl { get; set; }
    public string? EffectUrl { get; set; } // Animation or effect image
    
    // Spell mechanics
    [Required]
    [StringLength(50)]
    public string School { get; set; } = string.Empty; // "Earth", "Air", "Fire", "Water", "Light", "Dark"
    
    public int Level { get; set; } = 1; // 1-5 typical spell levels
    public int ManaCost { get; set; } = 0;
    public int BasePower { get; set; } = 0;
    
    // Spell characteristics
    [StringLength(50)]
    public string Type { get; set; } = string.Empty; // "Combat", "Adventure", "Global"
    
    [StringLength(50)]
    public string Target { get; set; } = string.Empty; // "Single", "Area", "All", "Self"
    
    [StringLength(50)]
    public string Duration { get; set; } = string.Empty; // "Instant", "Combat", "Permanent", "Turns"
    
    // Spell effects
    public string? Effects { get; set; } // JSON description of spell effects
    public string? Requirements { get; set; } // JSON for casting requirements
    
    // Availability
    public bool IsCommon { get; set; } = true; // Available to all schools vs faction-specific
    public int RequiredSkillLevel { get; set; } = 0; // Required magic skill level
    
    // Meta information
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    
    // Navigation properties
    public ICollection<FactionSpell> FactionSpells { get; set; } = new List<FactionSpell>();
}

// Junction table for many-to-many relationship between Factions and Spells
public class FactionSpell
{
    public int Id { get; set; }
    
    [Required]
    public int FactionId { get; set; }
    public Faction Faction { get; set; } = null!;
    
    [Required]
    public int SpellId { get; set; }
    public Spell Spell { get; set; } = null!;
    
    // Additional faction-specific spell properties
    public bool IsSignatureSpell { get; set; } = false; // Faction specialty spell
    public int? ModifiedManaCost { get; set; } // Faction-specific mana cost override
    public string? FactionModifications { get; set; } // JSON for faction-specific modifications
}