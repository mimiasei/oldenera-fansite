using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using OldenEraFanSite.Api.Services;
using System.Text;

Console.WriteLine("=== Starting OldenEra API ===");
Console.WriteLine($"Environment: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}");

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine("✓ WebApplication.CreateBuilder completed");

// Add services to the container.
Console.WriteLine("Adding basic services...");
builder.Services.AddControllers();
Console.WriteLine("✓ AddControllers completed");
builder.Services.AddEndpointsApiExplorer();
Console.WriteLine("✓ AddEndpointsApiExplorer completed");
builder.Services.AddSwaggerGen();
Console.WriteLine("✓ AddSwaggerGen completed");

// Add Entity Framework and PostgreSQL  
Console.WriteLine("Configuring database...");

// Debug environment variables
var allEnvVars = Environment.GetEnvironmentVariables();
Console.WriteLine($"Total environment variables: {allEnvVars.Count}");
Console.WriteLine($"DATABASE_URL exists: {Environment.GetEnvironmentVariable("DATABASE_URL") != null}");
Console.WriteLine($"DATABASE_URL value length: {Environment.GetEnvironmentVariable("DATABASE_URL")?.Length ?? 0}");

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? Environment.GetEnvironmentVariable("DATABASE_URL");

Console.WriteLine($"Database connection configured: {!string.IsNullOrEmpty(connectionString)}");

if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("ERROR: No database connection string found!");
    Console.WriteLine("Checking alternative environment variable names...");
    
    // Try alternative names in case of Render issues
    var altConnection = Environment.GetEnvironmentVariable("DATABASE_CONNECTION") 
        ?? Environment.GetEnvironmentVariable("POSTGRES_URL")
        ?? Environment.GetEnvironmentVariable("DB_URL");
        
    if (!string.IsNullOrEmpty(altConnection))
    {
        Console.WriteLine($"Found alternative connection: length {altConnection.Length}");
        connectionString = altConnection;
    }
    else
    {
        throw new InvalidOperationException("Database connection string not configured. Check DATABASE_URL environment variable.");
    }
}

Console.WriteLine("Adding DbContext...");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
Console.WriteLine("✓ DbContext added");

// Add Identity
Console.WriteLine("Adding Identity services...");
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
Console.WriteLine("✓ Identity services added");

// Add JWT Authentication
Console.WriteLine("Configuring JWT...");
var jwtSettings = builder.Configuration.GetSection("JWT");
var secretKeyString = jwtSettings["SecretKey"] 
    ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
    ?? throw new InvalidOperationException("JWT SecretKey not configured");

// Clean any potential whitespace from the key
secretKeyString = secretKeyString.Replace("\n", "").Replace("\r", "").Replace(" ", "").Replace("\t", "").Trim();

if (secretKeyString.Length < 32)
{
    throw new InvalidOperationException($"JWT SecretKey too short: {secretKeyString.Length} characters");
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

// Test database connection on startup (non-blocking for Render deployment)
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.CanConnectAsync();
    Console.WriteLine("Database connection successful");
}
catch (Exception ex)
{
    Console.WriteLine($"Database connection test failed: {ex.Message}");
    Console.WriteLine("Continuing startup - database will be tested on first request");
}

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