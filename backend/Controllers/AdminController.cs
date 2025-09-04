using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ModeratorOrAdmin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        ApplicationDbContext context,
        UserManager<User> userManager,
        ILogger<AdminController> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            var totalUsers = await _userManager.Users.CountAsync();
            var activeUsers = await _userManager.Users.Where(u => u.IsActive).CountAsync();
            var totalNews = await _context.NewsArticles.CountAsync();
            var publishedNews = await _context.NewsArticles.Where(n => n.IsPublished).CountAsync();
            var draftNews = totalNews - publishedNews;

            // Recent activity
            var recentUsers = await _userManager.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.CreatedAt
                })
                .ToListAsync();

            var recentNews = await _context.NewsArticles
                .OrderByDescending(n => n.CreatedAt)
                .Take(5)
                .Select(n => new {
                    n.Id,
                    n.Title,
                    n.Author,
                    n.CreatedAt,
                    n.IsPublished
                })
                .ToListAsync();

            // User roles distribution
            var adminUsers = await _userManager.GetUsersInRoleAsync("Admin");
            var moderatorUsers = await _userManager.GetUsersInRoleAsync("Moderator");
            var regularUsers = await _userManager.GetUsersInRoleAsync("User");

            var stats = new
            {
                Users = new
                {
                    Total = totalUsers,
                    Active = activeUsers,
                    Inactive = totalUsers - activeUsers,
                    Admins = adminUsers.Count,
                    Moderators = moderatorUsers.Count,
                    Regular = regularUsers.Count
                },
                News = new
                {
                    Total = totalNews,
                    Published = publishedNews,
                    Drafts = draftNews
                },
                RecentActivity = new
                {
                    Users = recentUsers,
                    News = recentNews
                }
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get dashboard statistics");
            return StatusCode(500, new { message = "Failed to load dashboard statistics" });
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null)
    {
        try
        {
            var query = _userManager.Users.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u => 
                    u.Email.Contains(search) ||
                    u.FirstName.Contains(search) ||
                    u.LastName.Contains(search));
            }

            // Get users with pagination
            var totalCount = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.CreatedAt,
                    u.LastLoginAt,
                    u.IsActive,
                    u.EmailConfirmed
                })
                .ToListAsync();

            // Get roles for each user
            var usersWithRoles = new List<object>();
            foreach (var user in users)
            {
                var userEntity = await _userManager.FindByIdAsync(user.Id);
                var userRoles = await _userManager.GetRolesAsync(userEntity!);
                
                usersWithRoles.Add(new {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.CreatedAt,
                    user.LastLoginAt,
                    user.IsActive,
                    user.EmailConfirmed,
                    Roles = userRoles
                });
            }

            // Filter by role if specified
            if (!string.IsNullOrWhiteSpace(role))
            {
                usersWithRoles = usersWithRoles
                    .Where(u => ((IList<string>)u.GetType().GetProperty("Roles")!.GetValue(u)!)
                        .Contains(role))
                    .ToList();
            }

            var response = new
            {
                Users = usersWithRoles,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get users list");
            return StatusCode(500, new { message = "Failed to load users" });
        }
    }

    [HttpPut("users/{userId}/status")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateUserStatus(string userId, [FromBody] UpdateUserStatusRequest request)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsActive = request.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to update user status", errors = result.Errors });
            }

            _logger.LogInformation("User {UserId} status updated to {Status} by {AdminId}", 
                userId, request.IsActive ? "Active" : "Inactive", User.Identity!.Name);

            return Ok(new { message = "User status updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update user status for {UserId}", userId);
            return StatusCode(500, new { message = "Failed to update user status" });
        }
    }

    [HttpPut("users/{userId}/roles")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateUserRoles(string userId, [FromBody] UpdateUserRolesRequest request)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Get current roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            
            // Remove all current roles
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                return BadRequest(new { message = "Failed to remove current roles", errors = removeResult.Errors });
            }

            // Add new roles
            var addResult = await _userManager.AddToRolesAsync(user, request.Roles);
            if (!addResult.Succeeded)
            {
                return BadRequest(new { message = "Failed to add new roles", errors = addResult.Errors });
            }

            _logger.LogInformation("User {UserId} roles updated to [{Roles}] by {AdminId}", 
                userId, string.Join(", ", request.Roles), User.Identity!.Name);

            return Ok(new { message = "User roles updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update user roles for {UserId}", userId);
            return StatusCode(500, new { message = "Failed to update user roles" });
        }
    }
}

public class UpdateUserStatusRequest
{
    public bool IsActive { get; set; }
}

public class UpdateUserRolesRequest
{
    public string[] Roles { get; set; } = Array.Empty<string>();
}