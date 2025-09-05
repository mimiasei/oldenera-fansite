using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MediaController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Media/Categories
    [HttpGet("Categories")]
    public async Task<ActionResult<IEnumerable<MediaCategory>>> GetMediaCategories(
        [FromQuery] bool activeOnly = true)
    {
        var query = _context.MediaCategories.AsQueryable();

        if (activeOnly)
        {
            query = query.Where(c => c.IsActive);
        }

        var categories = await query
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/Media
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MediaItem>>> GetMediaItems(
        [FromQuery] int? categoryId = null,
        [FromQuery] string? mediaType = null,
        [FromQuery] int? factionId = null,
        [FromQuery] bool featuredOnly = false,
        [FromQuery] bool approvedOnly = true,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.MediaItems
            .Include(m => m.Category)
            .Include(m => m.Faction)
            .Include(m => m.UploadedByUser)
            .AsQueryable();

        // Apply filters
        if (categoryId.HasValue)
        {
            query = query.Where(m => m.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrEmpty(mediaType))
        {
            query = query.Where(m => m.MediaType == mediaType);
        }

        if (factionId.HasValue)
        {
            query = query.Where(m => m.FactionId == factionId.Value);
        }

        if (featuredOnly)
        {
            query = query.Where(m => m.IsFeatured);
        }

        if (approvedOnly)
        {
            query = query.Where(m => m.IsApproved);
        }

        query = query.Where(m => m.IsActive);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(m => 
                m.Title.Contains(search) ||
                (m.Description != null && m.Description.Contains(search)) ||
                (m.Tags != null && m.Tags.Contains(search)));
        }

        // Get total count for pagination headers
        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        // Apply pagination
        var items = await query
            .OrderByDescending(m => m.IsFeatured)
            .ThenByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Add pagination headers
        Response.Headers["X-Total-Count"] = totalItems.ToString();
        Response.Headers["X-Page"] = page.ToString();
        Response.Headers["X-Page-Size"] = pageSize.ToString();
        Response.Headers["X-Total-Pages"] = totalPages.ToString();

        return Ok(items);
    }

    // GET: api/Media/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<MediaItem>> GetMediaItem(int id)
    {
        var mediaItem = await _context.MediaItems
            .Include(m => m.Category)
            .Include(m => m.Faction)
            .Include(m => m.UploadedByUser)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (mediaItem == null)
        {
            return NotFound();
        }

        // Increment view count
        mediaItem.ViewCount++;
        await _context.SaveChangesAsync();

        return mediaItem;
    }

    // GET: api/Media/Filters
    [HttpGet("Filters")]
    public async Task<ActionResult<object>> GetMediaFilters()
    {
        var categories = await _context.MediaCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new { c.Id, c.Name, c.Slug })
            .ToListAsync();

        var mediaTypes = await _context.MediaItems
            .Where(m => m.IsActive && m.IsApproved)
            .GroupBy(m => m.MediaType)
            .Select(g => g.Key)
            .OrderBy(t => t)
            .ToListAsync();

        var factions = await _context.Factions
            .Where(f => f.IsActive)
            .OrderBy(f => f.SortOrder)
            .ThenBy(f => f.Name)
            .Select(f => new { f.Id, f.Name })
            .ToListAsync();

        return Ok(new
        {
            Categories = categories,
            MediaTypes = mediaTypes,
            Factions = factions
        });
    }

    // POST: api/Media
    [HttpPost]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<MediaItem>> CreateMediaItem(MediaItem mediaItem)
    {
        // Set the uploaded by user
        mediaItem.UploadedByUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        mediaItem.CreatedAt = DateTime.UtcNow;
        mediaItem.UpdatedAt = DateTime.UtcNow;

        _context.MediaItems.Add(mediaItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMediaItem), new { id = mediaItem.Id }, mediaItem);
    }

    // PUT: api/Media/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<IActionResult> UpdateMediaItem(int id, MediaItem mediaItem)
    {
        if (id != mediaItem.Id)
        {
            return BadRequest();
        }

        var existingItem = await _context.MediaItems.FindAsync(id);
        if (existingItem == null)
        {
            return NotFound();
        }

        // Update properties
        existingItem.Title = mediaItem.Title;
        existingItem.Description = mediaItem.Description;
        existingItem.MediaType = mediaItem.MediaType;
        existingItem.OriginalUrl = mediaItem.OriginalUrl;
        existingItem.ThumbnailUrl = mediaItem.ThumbnailUrl;
        existingItem.LargeUrl = mediaItem.LargeUrl;
        existingItem.Tags = mediaItem.Tags;
        existingItem.AltText = mediaItem.AltText;
        existingItem.Caption = mediaItem.Caption;
        existingItem.CategoryId = mediaItem.CategoryId;
        existingItem.FactionId = mediaItem.FactionId;
        existingItem.IsApproved = mediaItem.IsApproved;
        existingItem.IsFeatured = mediaItem.IsFeatured;
        existingItem.IsActive = mediaItem.IsActive;
        existingItem.SortOrder = mediaItem.SortOrder;
        existingItem.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MediaItemExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Media/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMediaItem(int id)
    {
        var mediaItem = await _context.MediaItems.FindAsync(id);
        if (mediaItem == null)
        {
            return NotFound();
        }

        _context.MediaItems.Remove(mediaItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/Media/Categories
    [HttpPost("Categories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MediaCategory>> CreateMediaCategory(MediaCategory category)
    {
        category.CreatedAt = DateTime.UtcNow;
        category.UpdatedAt = DateTime.UtcNow;

        _context.MediaCategories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMediaCategory), new { id = category.Id }, category);
    }

    // GET: api/Media/Categories/{id}
    [HttpGet("Categories/{id}")]
    public async Task<ActionResult<MediaCategory>> GetMediaCategory(int id)
    {
        var category = await _context.MediaCategories
            .Include(c => c.MediaItems.Where(m => m.IsActive && m.IsApproved))
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound();
        }

        return category;
    }

    // PUT: api/Media/Categories/{id}
    [HttpPut("Categories/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateMediaCategory(int id, MediaCategory category)
    {
        if (id != category.Id)
        {
            return BadRequest();
        }

        var existingCategory = await _context.MediaCategories.FindAsync(id);
        if (existingCategory == null)
        {
            return NotFound();
        }

        existingCategory.Name = category.Name;
        existingCategory.Description = category.Description;
        existingCategory.Slug = category.Slug;
        existingCategory.IconUrl = category.IconUrl;
        existingCategory.ThumbnailUrl = category.ThumbnailUrl;
        existingCategory.Color = category.Color;
        existingCategory.IsActive = category.IsActive;
        existingCategory.SortOrder = category.SortOrder;
        existingCategory.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MediaCategoryExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Media/Categories/{id}
    [HttpDelete("Categories/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMediaCategory(int id)
    {
        var category = await _context.MediaCategories.FindAsync(id);
        if (category == null)
        {
            return NotFound();
        }

        // Check if category has media items
        var hasMediaItems = await _context.MediaItems.AnyAsync(m => m.CategoryId == id);
        if (hasMediaItems)
        {
            return BadRequest("Cannot delete category that contains media items.");
        }

        _context.MediaCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MediaItemExists(int id)
    {
        return _context.MediaItems.Any(e => e.Id == id);
    }

    private bool MediaCategoryExists(int id)
    {
        return _context.MediaCategories.Any(e => e.Id == id);
    }
}