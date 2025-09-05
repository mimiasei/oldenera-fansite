using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameInfoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GameInfoController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/GameInfo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameInfo>>> GetGameInfos(
        [FromQuery] string? category = null,
        [FromQuery] string? search = null,
        [FromQuery] bool featuredOnly = false,
        [FromQuery] bool publishedOnly = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.GameInfos.AsQueryable();

        if (publishedOnly)
        {
            query = query.Where(g => g.IsPublished);
        }

        if (featuredOnly)
        {
            query = query.Where(g => g.IsFeatured);
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(g => g.Category.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(g => 
                g.Title.Contains(search) ||
                g.Summary.Contains(search) ||
                g.Content.Contains(search) ||
                g.Tags.Any(t => t.Contains(search)));
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var gameInfos = await query
            .OrderBy(g => g.Category)
            .ThenBy(g => g.SortOrder)
            .ThenBy(g => g.Title)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Add pagination headers
        Response.Headers.Append("X-Total-Count", totalCount.ToString());
        Response.Headers.Append("X-Page", page.ToString());
        Response.Headers.Append("X-Page-Size", pageSize.ToString());
        Response.Headers.Append("X-Total-Pages", totalPages.ToString());

        return Ok(gameInfos);
    }

    // GET: api/GameInfo/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GameInfo>> GetGameInfo(int id)
    {
        var gameInfo = await _context.GameInfos.FindAsync(id);

        if (gameInfo == null)
        {
            return NotFound($"Game info with ID {id} not found.");
        }

        if (!gameInfo.IsPublished && !User.IsInRole("Admin") && !User.IsInRole("Moderator"))
        {
            return NotFound($"Game info with ID {id} not found.");
        }

        return Ok(gameInfo);
    }

    // GET: api/GameInfo/slug/gameplay-mechanics
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<GameInfo>> GetGameInfoBySlug(string slug)
    {
        var gameInfo = await _context.GameInfos
            .FirstOrDefaultAsync(g => g.Slug == slug);

        if (gameInfo == null)
        {
            return NotFound($"Game info with slug '{slug}' not found.");
        }

        if (!gameInfo.IsPublished && !User.IsInRole("Admin") && !User.IsInRole("Moderator"))
        {
            return NotFound($"Game info with slug '{slug}' not found.");
        }

        return Ok(gameInfo);
    }

    // GET: api/GameInfo/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<object>>> GetCategories()
    {
        var categories = await _context.GameInfos
            .Where(g => g.IsPublished && !string.IsNullOrEmpty(g.Category))
            .GroupBy(g => g.Category)
            .Select(group => new
            {
                Name = group.Key,
                Count = group.Count(),
                FeaturedCount = group.Count(g => g.IsFeatured)
            })
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/GameInfo/featured
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<GameInfo>>> GetFeaturedGameInfos([FromQuery] int limit = 6)
    {
        var featuredInfos = await _context.GameInfos
            .Where(g => g.IsPublished && g.IsFeatured)
            .OrderBy(g => g.SortOrder)
            .ThenByDescending(g => g.UpdatedAt)
            .Take(limit)
            .ToListAsync();

        return Ok(featuredInfos);
    }

    // GET: api/GameInfo/5/related
    [HttpGet("{id}/related")]
    public async Task<ActionResult<IEnumerable<GameInfo>>> GetRelatedGameInfos(int id, [FromQuery] int limit = 5)
    {
        var gameInfo = await _context.GameInfos.FindAsync(id);
        if (gameInfo == null)
        {
            return NotFound($"Game info with ID {id} not found.");
        }

        var relatedInfos = new List<GameInfo>();

        // Get explicitly related game infos
        if (gameInfo.RelatedGameInfoIds.Any())
        {
            var explicitRelated = await _context.GameInfos
                .Where(g => g.IsPublished && gameInfo.RelatedGameInfoIds.Contains(g.Id))
                .Take(limit)
                .ToListAsync();
            relatedInfos.AddRange(explicitRelated);
        }

        // Fill with same category items if needed
        if (relatedInfos.Count < limit)
        {
            var remainingLimit = limit - relatedInfos.Count;
            var categoryRelated = await _context.GameInfos
                .Where(g => g.IsPublished && 
                           g.Category == gameInfo.Category && 
                           g.Id != id &&
                           !relatedInfos.Select(r => r.Id).Contains(g.Id))
                .OrderBy(g => g.SortOrder)
                .Take(remainingLimit)
                .ToListAsync();
            relatedInfos.AddRange(categoryRelated);
        }

        return Ok(relatedInfos);
    }

    // POST: api/GameInfo
    [HttpPost]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<GameInfo>> CreateGameInfo(GameInfo gameInfo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Generate slug if not provided
        if (string.IsNullOrEmpty(gameInfo.Slug))
        {
            gameInfo.Slug = GenerateSlug(gameInfo.Title);
        }

        // Ensure slug is unique
        var existingSlug = await _context.GameInfos.AnyAsync(g => g.Slug == gameInfo.Slug);
        if (existingSlug)
        {
            return BadRequest($"Slug '{gameInfo.Slug}' already exists. Please choose a different slug.");
        }

        gameInfo.CreatedAt = DateTime.UtcNow;
        gameInfo.UpdatedAt = DateTime.UtcNow;
        gameInfo.Author = User.Identity?.Name ?? "Admin";

        _context.GameInfos.Add(gameInfo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGameInfo), new { id = gameInfo.Id }, gameInfo);
    }

    // PUT: api/GameInfo/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<IActionResult> UpdateGameInfo(int id, GameInfo gameInfo)
    {
        if (id != gameInfo.Id)
        {
            return BadRequest("ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingGameInfo = await _context.GameInfos.FindAsync(id);
        if (existingGameInfo == null)
        {
            return NotFound($"Game info with ID {id} not found.");
        }

        // Check if slug is changing and if it's unique
        if (gameInfo.Slug != existingGameInfo.Slug)
        {
            var existingSlug = await _context.GameInfos.AnyAsync(g => g.Slug == gameInfo.Slug && g.Id != id);
            if (existingSlug)
            {
                return BadRequest($"Slug '{gameInfo.Slug}' already exists. Please choose a different slug.");
            }
        }

        // Update properties
        existingGameInfo.Title = gameInfo.Title;
        existingGameInfo.Content = gameInfo.Content;
        existingGameInfo.Summary = gameInfo.Summary;
        existingGameInfo.Category = gameInfo.Category;
        existingGameInfo.Slug = gameInfo.Slug;
        existingGameInfo.BannerUrl = gameInfo.BannerUrl;
        existingGameInfo.IconUrl = gameInfo.IconUrl;
        existingGameInfo.ImageUrls = gameInfo.ImageUrls;
        existingGameInfo.SortOrder = gameInfo.SortOrder;
        existingGameInfo.IsPublished = gameInfo.IsPublished;
        existingGameInfo.IsFeatured = gameInfo.IsFeatured;
        existingGameInfo.MetaDescription = gameInfo.MetaDescription;
        existingGameInfo.Tags = gameInfo.Tags;
        existingGameInfo.RelatedFactionIds = gameInfo.RelatedFactionIds;
        existingGameInfo.RelatedGameInfoIds = gameInfo.RelatedGameInfoIds;
        existingGameInfo.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await GameInfoExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/GameInfo/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGameInfo(int id)
    {
        var gameInfo = await _context.GameInfos.FindAsync(id);
        if (gameInfo == null)
        {
            return NotFound($"Game info with ID {id} not found.");
        }

        _context.GameInfos.Remove(gameInfo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> GameInfoExists(int id)
    {
        return await _context.GameInfos.AnyAsync(g => g.Id == id);
    }

    private static string GenerateSlug(string title)
    {
        return title.ToLowerInvariant()
            .Replace(' ', '-')
            .Replace("&", "and")
            .Trim('-');
    }
}