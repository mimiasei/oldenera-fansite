using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using OldenEraFanSite.Api.Services;
using System.Text;
using DotNetEnv;

Console.WriteLine("=== Starting OldenEra API ===");

// Load .env file if it exists (for local development)
if (File.Exists(".env"))
{
    Env.Load();
    Console.WriteLine("✓ .env file loaded");
}

Console.WriteLine($"Environment: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework and PostgreSQL  
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Parse DATABASE_URL format if provided
if (!string.IsNullOrEmpty(databaseUrl))
{
    try
    {
        // Parse: postgresql://user:password@host:port/database
        var uri = new Uri(databaseUrl);
        var host = uri.Host;
        var port = uri.Port;
        var database = uri.AbsolutePath.TrimStart('/');
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";

        // Use SSL for production (cloud), disable for local development
        var isLocal = host == "localhost" || host == "127.0.0.1";
        var sslMode = isLocal ? "Disable" : "Require";
        var trustCert = isLocal ? "" : ";Trust Server Certificate=true";

        connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode={sslMode}{trustCert}";
        Console.WriteLine($"✓ Parsed DATABASE_URL for PostgreSQL connection (SSL: {sslMode})");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠ Failed to parse DATABASE_URL: {ex.Message}");
        Console.WriteLine($"Using DATABASE_URL directly: {databaseUrl}");
        connectionString = databaseUrl;
    }
}

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string not found. Please set DATABASE_URL environment variable or DefaultConnection in appsettings.json");
}

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
var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
    ?? builder.Configuration["JWT:SecretKey"] 
    ?? throw new InvalidOperationException("JWT_SECRET_KEY not found in environment variables or configuration");

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
    ?? builder.Configuration["JWT:Issuer"] 
    ?? throw new InvalidOperationException("JWT_ISSUER not found in environment variables or configuration");

var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
    ?? builder.Configuration["JWT:Audience"] 
    ?? throw new InvalidOperationException("JWT_AUDIENCE not found in environment variables or configuration");

// Clean any potential whitespace from the key
jwtSecretKey = jwtSecretKey.Replace("\n", "").Replace("\r", "").Replace(" ", "").Replace("\t", "").Trim();

if (jwtSecretKey.Length < 32)
{
    throw new InvalidOperationException($"JWT SecretKey too short: {jwtSecretKey.Length} characters");
}

var secretKey = Encoding.UTF8.GetBytes(jwtSecretKey);

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
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
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
                // Local development - allow all local origins
                corsBuilder.WithOrigins("http://localhost:5173", "http://localhost:3000")
                           .AllowAnyHeader()
                           .AllowAnyMethod();
            }
            else
            {
                // Production - allow both production domain AND development origins for testing
                corsBuilder.WithOrigins(
                               "https://oldenwiki.com",           // Production frontend
                               "http://localhost:5173",          // Local dev testing against prod API
                               "http://localhost:3000"           // Alternative local dev port
                           )
                           .AllowAnyHeader()
                           .AllowAnyMethod();
            }
        });
});

var app = builder.Build();

// Run database migrations and test connection
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    Console.WriteLine("Running database migrations...");
    await context.Database.MigrateAsync();
    Console.WriteLine("✓ Database migrations completed");
    
    await context.Database.CanConnectAsync();
    Console.WriteLine("✓ Database connection successful");
}
catch (Exception ex)
{
    Console.WriteLine($"⚠ Database setup failed: {ex.Message}");
    throw; // Re-throw to prevent startup with broken database
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Enable detailed request logging in development
    app.Use(async (context, next) =>
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("🌐 {Method} {Path} from {RemoteIp}", 
            context.Request.Method, 
            context.Request.Path, 
            context.Connection.RemoteIpAddress);
        
        await next();
        
        logger.LogInformation("✅ {Method} {Path} → {StatusCode}", 
            context.Request.Method, 
            context.Request.Path, 
            context.Response.StatusCode);
    });
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