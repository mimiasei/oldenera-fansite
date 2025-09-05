using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FactionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FactionController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Faction
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Faction>>> GetFactions(
        [FromQuery] bool includeUnits = false,
        [FromQuery] bool includeHeroes = false,
        [FromQuery] bool includeSpells = false,
        [FromQuery] bool activeOnly = true)
    {
        var query = _context.Factions.AsQueryable();

        if (activeOnly)
        {
            query = query.Where(f => f.IsActive);
        }

        if (includeUnits)
        {
            query = query.Include(f => f.Units.Where(u => !activeOnly || u.IsActive));
        }

        if (includeHeroes)
        {
            query = query.Include(f => f.Heroes.Where(h => !activeOnly || h.IsActive));
        }

        if (includeSpells)
        {
            query = query.Include(f => f.FactionSpells)
                         .ThenInclude(fs => fs.Spell);
        }

        var factions = await query
            .OrderBy(f => f.SortOrder)
            .ThenBy(f => f.Name)
            .ToListAsync();

        return Ok(factions);
    }

    // GET: api/Faction/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Faction>> GetFaction(int id,
        [FromQuery] bool includeUnits = false,
        [FromQuery] bool includeHeroes = false,
        [FromQuery] bool includeSpells = false)
    {
        var query = _context.Factions.AsQueryable();

        if (includeUnits)
        {
            query = query.Include(f => f.Units.Where(u => u.IsActive));
        }

        if (includeHeroes)
        {
            query = query.Include(f => f.Heroes.Where(h => h.IsActive));
        }

        if (includeSpells)
        {
            query = query.Include(f => f.FactionSpells)
                         .ThenInclude(fs => fs.Spell);
        }

        var faction = await query.FirstOrDefaultAsync(f => f.Id == id);

        if (faction == null)
        {
            return NotFound($"Faction with ID {id} not found.");
        }

        return Ok(faction);
    }

    // GET: api/Faction/5/units
    [HttpGet("{id}/units")]
    public async Task<ActionResult<IEnumerable<Unit>>> GetFactionUnits(int id,
        [FromQuery] int? tier = null,
        [FromQuery] string? unitType = null)
    {
        var faction = await _context.Factions.FindAsync(id);
        if (faction == null)
        {
            return NotFound($"Faction with ID {id} not found.");
        }

        var query = _context.Units.Where(u => u.FactionId == id && u.IsActive);

        if (tier.HasValue)
        {
            query = query.Where(u => u.Tier == tier.Value);
        }

        if (!string.IsNullOrEmpty(unitType))
        {
            query = query.Where(u => u.UnitType == unitType);
        }

        var units = await query
            .OrderBy(u => u.Tier)
            .ThenBy(u => u.SortOrder)
            .ThenBy(u => u.Name)
            .ToListAsync();

        return Ok(units);
    }

    // GET: api/Faction/5/heroes
    [HttpGet("{id}/heroes")]
    public async Task<ActionResult<IEnumerable<Hero>>> GetFactionHeroes(int id,
        [FromQuery] string? heroClass = null,
        [FromQuery] string? heroType = null)
    {
        var faction = await _context.Factions.FindAsync(id);
        if (faction == null)
        {
            return NotFound($"Faction with ID {id} not found.");
        }

        var query = _context.Heroes.Where(h => h.FactionId == id && h.IsActive);

        if (!string.IsNullOrEmpty(heroClass))
        {
            query = query.Where(h => h.HeroClass == heroClass);
        }

        if (!string.IsNullOrEmpty(heroType))
        {
            query = query.Where(h => h.HeroType == heroType);
        }

        var heroes = await query
            .OrderBy(h => h.SortOrder)
            .ThenBy(h => h.Name)
            .ToListAsync();

        return Ok(heroes);
    }

    // POST: api/Faction
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Faction>> CreateFaction(Faction faction)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        faction.CreatedAt = DateTime.UtcNow;
        faction.UpdatedAt = DateTime.UtcNow;

        _context.Factions.Add(faction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFaction), new { id = faction.Id }, faction);
    }

    // PUT: api/Faction/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFaction(int id, Faction faction)
    {
        if (id != faction.Id)
        {
            return BadRequest("ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingFaction = await _context.Factions.FindAsync(id);
        if (existingFaction == null)
        {
            return NotFound($"Faction with ID {id} not found.");
        }

        // Update properties
        existingFaction.Name = faction.Name;
        existingFaction.Description = faction.Description;
        existingFaction.Summary = faction.Summary;
        existingFaction.LogoUrl = faction.LogoUrl;
        existingFaction.BannerUrl = faction.BannerUrl;
        existingFaction.BackgroundUrl = faction.BackgroundUrl;
        existingFaction.Alignment = faction.Alignment;
        existingFaction.Specialty = faction.Specialty;
        existingFaction.StartingResources = faction.StartingResources;
        existingFaction.FactionBonuses = faction.FactionBonuses;
        existingFaction.IsActive = faction.IsActive;
        existingFaction.SortOrder = faction.SortOrder;
        existingFaction.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await FactionExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Faction/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFaction(int id)
    {
        var faction = await _context.Factions.FindAsync(id);
        if (faction == null)
        {
            return NotFound($"Faction with ID {id} not found.");
        }

        _context.Factions.Remove(faction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> FactionExists(int id)
    {
        return await _context.Factions.AnyAsync(f => f.Id == id);
    }
}