using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NewsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetNews(
        [FromQuery] string? search = null,
        [FromQuery] string? tag = null,
        [FromQuery] string? author = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.NewsArticles
            .Where(n => n.IsPublished);

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(n => 
                n.Title.Contains(search) ||
                n.Summary.Contains(search) ||
                n.Content.Contains(search));
        }

        // Apply tag filter
        if (!string.IsNullOrWhiteSpace(tag))
        {
            query = query.Where(n => n.Tags.Contains(tag));
        }

        // Apply author filter
        if (!string.IsNullOrWhiteSpace(author))
        {
            query = query.Where(n => n.Author.Contains(author));
        }

        // Apply pagination and ordering
        var articles = await query
            .OrderByDescending(n => n.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Get total count for pagination info
        var totalCount = await query.CountAsync();
        
        Response.Headers["X-Total-Count"] = totalCount.ToString();
        Response.Headers["X-Page"] = page.ToString();
        Response.Headers["X-Page-Size"] = pageSize.ToString();
        Response.Headers["X-Total-Pages"] = ((int)Math.Ceiling((double)totalCount / pageSize)).ToString();

        return Ok(articles);
    }

    [HttpGet("filters")]
    public async Task<ActionResult<object>> GetFilters()
    {
        var articles = await _context.NewsArticles
            .Where(n => n.IsPublished)
            .Select(n => new { n.Tags, n.Author })
            .ToListAsync();

        var tags = articles.SelectMany(a => a.Tags).Distinct().OrderBy(t => t).ToList();
        var authors = articles.Select(a => a.Author).Distinct().OrderBy(a => a).ToList();

        return Ok(new { tags, authors });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NewsArticle>> GetNewsArticle(int id)
    {
        var newsArticle = await _context.NewsArticles.FindAsync(id);

        if (newsArticle == null)
        {
            return NotFound();
        }

        return newsArticle;
    }

    [HttpPost]
    public async Task<ActionResult<NewsArticle>> PostNewsArticle(NewsArticle newsArticle)
    {
        newsArticle.CreatedAt = DateTime.UtcNow;
        newsArticle.UpdatedAt = DateTime.UtcNow;
        
        if (newsArticle.IsPublished && newsArticle.PublishedAt == default)
        {
            newsArticle.PublishedAt = DateTime.UtcNow;
        }

        _context.NewsArticles.Add(newsArticle);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNewsArticle), new { id = newsArticle.Id }, newsArticle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutNewsArticle(int id, NewsArticle newsArticle)
    {
        if (id != newsArticle.Id)
        {
            return BadRequest();
        }

        newsArticle.UpdatedAt = DateTime.UtcNow;
        _context.Entry(newsArticle).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!NewsArticleExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNewsArticle(int id)
    {
        var newsArticle = await _context.NewsArticles.FindAsync(id);
        if (newsArticle == null)
        {
            return NotFound();
        }

        _context.NewsArticles.Remove(newsArticle);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool NewsArticleExists(int id)
    {
        return _context.NewsArticles.Any(e => e.Id == id);
    }
}