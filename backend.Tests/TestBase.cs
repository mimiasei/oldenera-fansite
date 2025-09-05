using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace OldenEraFanSite.Api.Tests;

public class TestBase : IDisposable
{
    protected readonly WebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly ApplicationDbContext Context;

    private readonly string _databaseName;

    public TestBase()
    {
        _databaseName = Guid.NewGuid().ToString();

        Factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the existing DbContext
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Add InMemory database for testing with same database name
                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseInMemoryDatabase(databaseName: _databaseName);
                    });

                    // Configure JSON to handle circular references
                    services.ConfigureHttpJsonOptions(options =>
                    {
                        options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                    });

                    services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(options =>
                    {
                        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                    });
                });

                builder.ConfigureAppConfiguration((context, config) =>
                {
                    config.AddInMemoryCollection(new Dictionary<string, string>
                    {
                        {"JWT:SecretKey", "olden-era-super-secret-jwt-key-for-development-only-change-in-production"},
                        {"JWT:Issuer", "https://localhost:5000"},
                        {"JWT:Audience", "oldenerafansite-client"},
                        {"JWT:ExpiryInMinutes", "60"}
                    });
                });
            });

        Client = Factory.CreateClient();
        
        // Create a scope and seed data after the factory is built
        using (var scope = Factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.EnsureCreated();
            SeedTestData(context);
        }

        // Get a fresh context instance for use in tests
        Context = Factory.Services.CreateScope().ServiceProvider.GetRequiredService<ApplicationDbContext>();
    }

    protected static void SeedTestData(ApplicationDbContext context)
    {
        // Create test users
        var adminUser = new User
        {
            Id = "admin-user-id",
            UserName = "admin@test.com",
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            EmailConfirmed = true
        };

        var moderatorUser = new User
        {
            Id = "moderator-user-id",
            UserName = "moderator@test.com",
            Email = "moderator@test.com",
            FirstName = "Moderator", 
            LastName = "User",
            EmailConfirmed = true
        };

        var regularUser = new User
        {
            Id = "regular-user-id",
            UserName = "user@test.com",
            Email = "user@test.com",
            FirstName = "Regular",
            LastName = "User",
            EmailConfirmed = true
        };

        context.Users.AddRange(adminUser, moderatorUser, regularUser);

        // Create test roles
        var adminRole = new IdentityRole { Id = "admin-role-id", Name = "Admin", NormalizedName = "ADMIN" };
        var moderatorRole = new IdentityRole { Id = "moderator-role-id", Name = "Moderator", NormalizedName = "MODERATOR" };
        var userRole = new IdentityRole { Id = "user-role-id", Name = "User", NormalizedName = "USER" };

        context.Roles.AddRange(adminRole, moderatorRole, userRole);

        // Assign roles to users
        context.UserRoles.AddRange(
            new IdentityUserRole<string> { UserId = adminUser.Id, RoleId = adminRole.Id },
            new IdentityUserRole<string> { UserId = moderatorUser.Id, RoleId = moderatorRole.Id },
            new IdentityUserRole<string> { UserId = regularUser.Id, RoleId = userRole.Id }
        );

        // Create test factions
        var havenFaction = new Faction
        {
            Id = 1,
            Name = "Haven",
            Description = "Test Haven faction",
            Summary = "Order-aligned faction",
            Alignment = "Order",
            Specialty = "Divine magic and heavy cavalry",
            IsActive = true,
            SortOrder = 1
        };

        context.Factions.Add(havenFaction);

        // Create test media categories
        var screenshotsCategory = new MediaCategory
        {
            Id = 1,
            Name = "Screenshots",
            Description = "Gameplay screenshots",
            Slug = "screenshots",
            Color = "#10B981",
            IsActive = true,
            SortOrder = 1
        };

        var conceptArtCategory = new MediaCategory
        {
            Id = 2,
            Name = "Concept Art",
            Description = "Early concept art",
            Slug = "concept-art", 
            Color = "#8B5CF6",
            IsActive = true,
            SortOrder = 2
        };

        context.MediaCategories.AddRange(screenshotsCategory, conceptArtCategory);

        // Create test media items
        var mediaItem1 = new MediaItem
        {
            Id = 1,
            Title = "Test Screenshot 1",
            Description = "A test screenshot",
            MediaType = "image",
            OriginalUrl = "/test/image1.jpg",
            ThumbnailUrl = "/test/thumb1.jpg",
            CategoryId = 1,
            FactionId = 1,
            UploadedByUserId = adminUser.Id,
            IsApproved = true,
            IsFeatured = true,
            IsActive = true,
            ViewCount = 100,
            Width = 1920,
            Height = 1080
        };

        var mediaItem2 = new MediaItem
        {
            Id = 2,
            Title = "Test Concept Art",
            Description = "A test concept art",
            MediaType = "image",
            OriginalUrl = "/test/image2.jpg",
            ThumbnailUrl = "/test/thumb2.jpg",
            CategoryId = 2,
            UploadedByUserId = moderatorUser.Id,
            IsApproved = false,
            IsFeatured = false,
            IsActive = true,
            ViewCount = 50,
            Width = 1024,
            Height = 768
        };

        context.MediaItems.AddRange(mediaItem1, mediaItem2);
        context.SaveChanges();
    }

    protected string GenerateJwtToken(string userId, string email, params string[] roles)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("olden-era-super-secret-jwt-key-for-development-only-change-in-production");
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Name, email)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = "https://localhost:5000",
            Audience = "oldenerafansite-client"
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    protected void SetAuthorizationHeader(string token)
    {
        Client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
    }

    public void Dispose()
    {
        Client?.Dispose();
        Factory?.Dispose();
        Context?.Dispose();
        GC.SuppressFinalize(this);
    }
}