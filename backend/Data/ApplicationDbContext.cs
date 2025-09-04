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
    }
}