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

// Debug logging for JWT configuration
var configSecretKey = jwtSettings["SecretKey"];
var envSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
Console.WriteLine($"Config SecretKey length: {configSecretKey?.Length ?? 0}");
Console.WriteLine($"Env JWT_SECRET_KEY length: {envSecretKey?.Length ?? 0}");

// Debug: Show raw environment variable with character codes
if (envSecretKey != null)
{
    Console.WriteLine($"Env key first 20 chars as bytes: {string.Join(",", envSecretKey.Take(20).Select(c => (int)c))}");
}

var secretKeyString = configSecretKey;
if (string.IsNullOrWhiteSpace(secretKeyString))
{
    secretKeyString = envSecretKey;
    Console.WriteLine($"Using environment variable: '{secretKeyString?.Substring(0, Math.Min(10, secretKeyString?.Length ?? 0))}...' (length: {secretKeyString?.Length ?? 0})");
}
if (string.IsNullOrWhiteSpace(secretKeyString))
{
    Console.WriteLine("Using fallback secret key");
    secretKeyString = "h8F2kL9mN3pQ6rS7tU8vW9xY0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4b";
}

// Clean the key
secretKeyString = secretKeyString?.Replace("\n", "").Replace("\r", "").Replace(" ", "").Replace("\t", "").Trim();

Console.WriteLine($"Final cleaned key length: {secretKeyString?.Length ?? 0}");

if (string.IsNullOrEmpty(secretKeyString) || secretKeyString.Length < 32)
{
    Console.WriteLine("ERROR: Secret key is still invalid after processing");
    throw new InvalidOperationException($"JWT SecretKey is invalid. Length: {secretKeyString?.Length ?? 0}");
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

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// Make Program class public for testing
public partial class Program { }