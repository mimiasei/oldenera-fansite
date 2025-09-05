using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<NewsArticle> NewsArticles { get; set; }
    public DbSet<Faction> Factions { get; set; }
    public DbSet<Unit> Units { get; set; }
    public DbSet<Spell> Spells { get; set; }
    public DbSet<FactionSpell> FactionSpells { get; set; }
    public DbSet<Hero> Heroes { get; set; }
    public DbSet<GameInfo> GameInfos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // News Article configuration
        modelBuilder.Entity<NewsArticle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.GoogleId).IsUnique();
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
            entity.Property(e => e.GoogleId).HasMaxLength(100);
        });

        // Faction configuration
        modelBuilder.Entity<Faction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.StartingResources)
                .HasConversion(
                    v => v,
                    v => v);
            entity.Property(e => e.FactionBonuses)
                .HasConversion(
                    v => v,
                    v => v);
        });

        // Unit configuration
        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.FactionId, e.Name });
            
            entity.HasOne(e => e.Faction)
                .WithMany(f => f.Units)
                .HasForeignKey(e => e.FactionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.BaseUnit)
                .WithMany(u => u.Upgrades)
                .HasForeignKey(e => e.BaseUnitId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.Property(e => e.ResourceCosts)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.SpecialAbilities)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.Immunities)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.Resistances)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.BuildingRequirements)
                .HasConversion(v => v, v => v);
        });

        // Spell configuration
        modelBuilder.Entity<Spell>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasIndex(e => new { e.School, e.Level });
            
            entity.Property(e => e.Effects)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.Requirements)
                .HasConversion(v => v, v => v);
        });

        // FactionSpell configuration
        modelBuilder.Entity<FactionSpell>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.FactionId, e.SpellId }).IsUnique();
            
            entity.HasOne(e => e.Faction)
                .WithMany(f => f.FactionSpells)
                .HasForeignKey(e => e.FactionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Spell)
                .WithMany(s => s.FactionSpells)
                .HasForeignKey(e => e.SpellId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.Property(e => e.FactionModifications)
                .HasConversion(v => v, v => v);
        });

        // Hero configuration
        modelBuilder.Entity<Hero>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.FactionId, e.Name });
            
            entity.HasOne(e => e.Faction)
                .WithMany(f => f.Heroes)
                .HasForeignKey(e => e.FactionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.Property(e => e.SpecialtyEffects)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.StartingSkills)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.StartingSpells)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.StartingArtifacts)
                .HasConversion(v => v, v => v);
            entity.Property(e => e.PreferredTerrain)
                .HasConversion(v => v, v => v);
        });

        // GameInfo configuration
        modelBuilder.Entity<GameInfo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => new { e.Category, e.SortOrder });
            
            entity.Property(e => e.ImageUrls)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
            entity.Property(e => e.RelatedFactionIds)
                .HasConversion(
                    v => string.Join(',', v.Select(x => x.ToString())),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                          .Select(x => int.Parse(x)).ToList());
            entity.Property(e => e.RelatedGameInfoIds)
                .HasConversion(
                    v => string.Join(',', v.Select(x => x.ToString())),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                          .Select(x => int.Parse(x)).ToList());
        });
    }
}