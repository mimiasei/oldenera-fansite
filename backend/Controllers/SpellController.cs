using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpellController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SpellController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Spell
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Spell>>> GetSpells(
        [FromQuery] string? school = null,
        [FromQuery] int? level = null,
        [FromQuery] string? type = null,
        [FromQuery] bool? isCommon = null,
        [FromQuery] bool activeOnly = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = _context.Spells.AsQueryable();

        if (activeOnly)
        {
            query = query.Where(s => s.IsActive);
        }

        if (!string.IsNullOrEmpty(school))
        {
            query = query.Where(s => s.School == school);
        }

        if (level.HasValue)
        {
            query = query.Where(s => s.Level == level.Value);
        }

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(s => s.Type == type);
        }

        if (isCommon.HasValue)
        {
            query = query.Where(s => s.IsCommon == isCommon.Value);
        }

        var totalCount = await query.CountAsync();

        var spells = await query
            .OrderBy(s => s.School)
            .ThenBy(s => s.Level)
            .ThenBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Add pagination headers
        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        Response.Headers.Add("X-Page", page.ToString());
        Response.Headers.Add("X-Page-Size", pageSize.ToString());
        Response.Headers.Add("X-Total-Pages", Math.Ceiling((double)totalCount / pageSize).ToString());

        return Ok(spells);
    }

    // GET: api/Spell/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Spell>> GetSpell(int id,
        [FromQuery] bool includeFactionSpells = false)
    {
        var query = _context.Spells.AsQueryable();

        if (includeFactionSpells)
        {
            query = query.Include(s => s.FactionSpells)
                         .ThenInclude(fs => fs.Faction);
        }

        var spell = await query.FirstOrDefaultAsync(s => s.Id == id);

        if (spell == null)
        {
            return NotFound($"Spell with ID {id} not found.");
        }

        return Ok(spell);
    }

    // GET: api/Spell/filters
    [HttpGet("filters")]
    public async Task<ActionResult<object>> GetSpellFilters()
    {
        var schools = await _context.Spells
            .Where(s => s.IsActive && !string.IsNullOrEmpty(s.School))
            .Select(s => s.School)
            .Distinct()
            .OrderBy(school => school)
            .ToListAsync();

        var levels = await _context.Spells
            .Where(s => s.IsActive)
            .Select(s => s.Level)
            .Distinct()
            .OrderBy(level => level)
            .ToListAsync();

        var types = await _context.Spells
            .Where(s => s.IsActive && !string.IsNullOrEmpty(s.Type))
            .Select(s => s.Type)
            .Distinct()
            .OrderBy(type => type)
            .ToListAsync();

        return Ok(new
        {
            Schools = schools,
            Levels = levels,
            Types = types
        });
    }

    // POST: api/Spell
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Spell>> CreateSpell(Spell spell)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        spell.CreatedAt = DateTime.UtcNow;
        spell.UpdatedAt = DateTime.UtcNow;

        _context.Spells.Add(spell);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpell), new { id = spell.Id }, spell);
    }

    // PUT: api/Spell/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSpell(int id, Spell spell)
    {
        if (id != spell.Id)
        {
            return BadRequest("ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingSpell = await _context.Spells.FindAsync(id);
        if (existingSpell == null)
        {
            return NotFound($"Spell with ID {id} not found.");
        }

        // Update properties
        existingSpell.Name = spell.Name;
        existingSpell.Description = spell.Description;
        existingSpell.Summary = spell.Summary;
        existingSpell.IconUrl = spell.IconUrl;
        existingSpell.EffectUrl = spell.EffectUrl;
        existingSpell.School = spell.School;
        existingSpell.Level = spell.Level;
        existingSpell.ManaCost = spell.ManaCost;
        existingSpell.BasePower = spell.BasePower;
        existingSpell.Type = spell.Type;
        existingSpell.Target = spell.Target;
        existingSpell.Duration = spell.Duration;
        existingSpell.Effects = spell.Effects;
        existingSpell.Requirements = spell.Requirements;
        existingSpell.IsCommon = spell.IsCommon;
        existingSpell.RequiredSkillLevel = spell.RequiredSkillLevel;
        existingSpell.IsActive = spell.IsActive;
        existingSpell.SortOrder = spell.SortOrder;
        existingSpell.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await SpellExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Spell/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSpell(int id)
    {
        var spell = await _context.Spells.FindAsync(id);
        if (spell == null)
        {
            return NotFound($"Spell with ID {id} not found.");
        }

        _context.Spells.Remove(spell);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> SpellExists(int id)
    {
        return await _context.Spells.AnyAsync(s => s.Id == id);
    }
}