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
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetNews()
    {
        return await _context.NewsArticles
            .Where(n => n.IsPublished)
            .OrderByDescending(n => n.PublishedAt)
            .ToListAsync();
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