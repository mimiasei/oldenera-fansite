using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using OldenEraFanSite.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework and PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? Environment.GetEnvironmentVariable("DATABASE_URL");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add Identity
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    
    // Sign-in settings
    options.SignIn.RequireConfirmedAccount = false; // Will be true when email confirmation is implemented
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JWT");
var rawSecretKey = jwtSettings["SecretKey"] ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY");

Console.WriteLine($"Raw secret key length: {rawSecretKey?.Length ?? 0}");
Console.WriteLine($"Raw secret key preview: '{rawSecretKey?.Substring(0, Math.Min(20, rawSecretKey?.Length ?? 0))}...'");

if (string.IsNullOrEmpty(rawSecretKey))
{
    throw new InvalidOperationException("JWT SecretKey not configured - check environment variables");
}

// Clean any potential whitespace from the key
var secretKeyString = rawSecretKey.Replace("\n", "").Replace("\r", "").Replace(" ", "").Replace("\t", "").Trim();

Console.WriteLine($"Cleaned secret key length: {secretKeyString.Length}");
Console.WriteLine($"First 10 chars after cleaning: '{secretKeyString.Substring(0, Math.Min(10, secretKeyString.Length))}'");

if (secretKeyString.Length < 32)
{
    Console.WriteLine($"ERROR: Secret key too short ({secretKeyString.Length} chars)");
    Console.WriteLine("Please check your JWT_SECRET_KEY environment variable in Render");
    throw new InvalidOperationException($"JWT SecretKey too short after cleaning: {secretKeyString.Length} characters (need at least 32)");
}

var secretKey = Encoding.UTF8.GetBytes(secretKeyString);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = builder.Environment.IsProduction();
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ModeratorOrAdmin", policy => policy.RequireRole("Moderator", "Admin"));
});

// Add custom services
builder.Services.AddScoped<IJwtService, JwtService>();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        corsBuilder =>
        {
            if (builder.Environment.IsDevelopment())
            {
                corsBuilder.WithOrigins("http://localhost:5173", "http://localhost:3000")
                           .AllowAnyHeader()
                           .AllowAnyMethod();
            }
            else
            {
                // Configure for production - update with your actual frontend domain
                corsBuilder.WithOrigins("https://oldenwiki.com")
                           .AllowAnyHeader()
                           .AllowAnyMethod();
            }
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Enable Swagger in production for testing
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "OldenEra API V1");
        c.RoutePrefix = "swagger";
    });
}

// Skip HTTPS redirection in production (Render handles this)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Add root endpoint for health check
app.MapGet("/", () => new { 
    status = "OK", 
    message = "OldenEra Fan Site API is running", 
    timestamp = DateTime.UtcNow,
    endpoints = new[] { "/api/news", "/api/media/categories", "/swagger" }
});

// Add health check endpoint
app.MapGet("/health", () => new { 
    status = "Healthy", 
    timestamp = DateTime.UtcNow 
});

app.Run();

// Make Program class public for testing
public partial class Program { }