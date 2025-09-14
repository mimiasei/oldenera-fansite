using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HeroController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HeroController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Hero
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Hero>>> GetHeroes(
        [FromQuery] int? factionId = null,
        [FromQuery] string? heroClass = null,
        [FromQuery] string? heroType = null,
        [FromQuery] bool activeOnly = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = _context.Heroes.Include(h => h.Faction).AsQueryable();

        if (activeOnly)
        {
            query = query.Where(h => h.IsActive);
        }

        if (factionId.HasValue)
        {
            query = query.Where(h => h.FactionId == factionId.Value);
        }

        if (!string.IsNullOrEmpty(heroClass))
        {
            query = query.Where(h => h.HeroClass == heroClass);
        }

        if (!string.IsNullOrEmpty(heroType))
        {
            query = query.Where(h => h.HeroType == heroType);
        }

        var totalCount = await query.CountAsync();

        var heroes = await query
            .OrderBy(h => h.Faction.Name)
            .ThenBy(h => h.SortOrder)
            .ThenBy(h => h.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Add pagination headers
        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        Response.Headers.Add("X-Page", page.ToString());
        Response.Headers.Add("X-Page-Size", pageSize.ToString());
        Response.Headers.Add("X-Total-Pages", Math.Ceiling((double)totalCount / pageSize).ToString());

        return Ok(heroes);
    }

    // GET: api/Hero/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Hero>> GetHero(int id,
        [FromQuery] bool includeFaction = false)
    {
        var query = _context.Heroes.AsQueryable();

        if (includeFaction)
        {
            query = query.Include(h => h.Faction);
        }

        var hero = await query.FirstOrDefaultAsync(h => h.Id == id);

        if (hero == null)
        {
            return NotFound($"Hero with ID {id} not found.");
        }

        return Ok(hero);
    }

    // GET: api/Hero/filters
    [HttpGet("filters")]
    public async Task<ActionResult<object>> GetHeroFilters()
    {
        var heroClasses = await _context.Heroes
            .Where(h => h.IsActive && !string.IsNullOrEmpty(h.HeroClass))
            .Select(h => h.HeroClass)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        var heroTypes = await _context.Heroes
            .Where(h => h.IsActive && !string.IsNullOrEmpty(h.HeroType))
            .Select(h => h.HeroType)
            .Distinct()
            .OrderBy(t => t)
            .ToListAsync();

        var factions = await _context.Factions
            .Where(f => f.IsActive)
            .Select(f => new { f.Id, f.Name })
            .OrderBy(f => f.Name)
            .ToListAsync();

        return Ok(new
        {
            HeroClasses = heroClasses,
            HeroTypes = heroTypes,
            Factions = factions
        });
    }

    // POST: api/Hero
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Hero>> CreateHero(Hero hero)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verify faction exists
        var faction = await _context.Factions.FindAsync(hero.FactionId);
        if (faction == null)
        {
            return BadRequest($"Faction with ID {hero.FactionId} not found.");
        }

        hero.CreatedAt = DateTime.UtcNow;
        hero.UpdatedAt = DateTime.UtcNow;

        _context.Heroes.Add(hero);
        await _context.SaveChangesAsync();

        // Load the hero with faction for response
        await _context.Entry(hero).Reference(h => h.Faction).LoadAsync();

        return CreatedAtAction(nameof(GetHero), new { id = hero.Id }, hero);
    }

    // PUT: api/Hero/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateHero(int id, Hero hero)
    {
        if (id != hero.Id)
        {
            return BadRequest("ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingHero = await _context.Heroes.FindAsync(id);
        if (existingHero == null)
        {
            return NotFound($"Hero with ID {id} not found.");
        }

        // Verify faction exists
        var faction = await _context.Factions.FindAsync(hero.FactionId);
        if (faction == null)
        {
            return BadRequest($"Faction with ID {hero.FactionId} not found.");
        }

        // Update properties
        existingHero.Name = hero.Name;
        existingHero.Biography = hero.Biography;
        existingHero.Summary = hero.Summary;
        existingHero.PortraitUrl = hero.PortraitUrl;
        existingHero.FullImageUrl = hero.FullImageUrl;
        existingHero.FactionId = hero.FactionId;
        existingHero.HeroClass = hero.HeroClass;
        existingHero.HeroType = hero.HeroType;
        existingHero.StartingAttack = hero.StartingAttack;
        existingHero.StartingDefense = hero.StartingDefense;
        existingHero.StartingSpellPower = hero.StartingSpellPower;
        existingHero.StartingKnowledge = hero.StartingKnowledge;
        existingHero.Specialty = hero.Specialty;
        existingHero.SpecialtyDescription = hero.SpecialtyDescription;
        existingHero.SpecialtyEffects = hero.SpecialtyEffects;
        existingHero.StartingSkills = hero.StartingSkills;
        existingHero.StartingSpells = hero.StartingSpells;
        existingHero.StartingArtifacts = hero.StartingArtifacts;
        existingHero.PreferredTerrain = hero.PreferredTerrain;
        existingHero.RarityLevel = hero.RarityLevel;
        existingHero.Title = hero.Title;
        existingHero.Background = hero.Background;
        existingHero.IsActive = hero.IsActive;
        existingHero.SortOrder = hero.SortOrder;
        existingHero.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await HeroExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Hero/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteHero(int id)
    {
        var hero = await _context.Heroes.FindAsync(id);
        if (hero == null)
        {
            return NotFound($"Hero with ID {id} not found.");
        }

        _context.Heroes.Remove(hero);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> HeroExists(int id)
    {
        return await _context.Heroes.AnyAsync(h => h.Id == id);
    }
}