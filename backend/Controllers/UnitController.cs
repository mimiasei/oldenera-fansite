using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UnitController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Unit
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Unit>>> GetUnits(
        [FromQuery] int? factionId = null,
        [FromQuery] int? tier = null,
        [FromQuery] string? unitType = null,
        [FromQuery] bool activeOnly = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = _context.Units.Include(u => u.Faction).AsQueryable();

        if (activeOnly)
        {
            query = query.Where(u => u.IsActive);
        }

        if (factionId.HasValue)
        {
            query = query.Where(u => u.FactionId == factionId.Value);
        }

        if (tier.HasValue)
        {
            query = query.Where(u => u.Tier == tier.Value);
        }

        if (!string.IsNullOrEmpty(unitType))
        {
            query = query.Where(u => u.UnitType == unitType);
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var units = await query
            .OrderBy(u => u.FactionId)
            .ThenBy(u => u.Tier)
            .ThenBy(u => u.SortOrder)
            .ThenBy(u => u.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Add pagination headers
        Response.Headers.Append("X-Total-Count", totalCount.ToString());
        Response.Headers.Append("X-Page", page.ToString());
        Response.Headers.Append("X-Page-Size", pageSize.ToString());
        Response.Headers.Append("X-Total-Pages", totalPages.ToString());

        return Ok(units);
    }

    // GET: api/Unit/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Unit>> GetUnit(int id, [FromQuery] bool includeUpgrades = false)
    {
        var query = _context.Units.Include(u => u.Faction).AsQueryable();

        if (includeUpgrades)
        {
            query = query.Include(u => u.Upgrades)
                         .Include(u => u.BaseUnit);
        }

        var unit = await query.FirstOrDefaultAsync(u => u.Id == id);

        if (unit == null)
        {
            return NotFound($"Unit with ID {id} not found.");
        }

        return Ok(unit);
    }

    // GET: api/Unit/filters
    [HttpGet("filters")]
    public async Task<ActionResult<object>> GetUnitFilters()
    {
        var unitTypes = await _context.Units
            .Where(u => u.IsActive && !string.IsNullOrEmpty(u.UnitType))
            .Select(u => u.UnitType)
            .Distinct()
            .OrderBy(t => t)
            .ToListAsync();

        var tiers = await _context.Units
            .Where(u => u.IsActive)
            .Select(u => u.Tier)
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
            UnitTypes = unitTypes,
            Tiers = tiers,
            Factions = factions
        });
    }

    // POST: api/Unit
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Unit>> CreateUnit(Unit unit)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verify faction exists
        var faction = await _context.Factions.FindAsync(unit.FactionId);
        if (faction == null)
        {
            return BadRequest($"Faction with ID {unit.FactionId} not found.");
        }

        // Verify base unit exists if specified
        if (unit.BaseUnitId.HasValue)
        {
            var baseUnit = await _context.Units.FindAsync(unit.BaseUnitId.Value);
            if (baseUnit == null)
            {
                return BadRequest($"Base unit with ID {unit.BaseUnitId} not found.");
            }
        }

        unit.CreatedAt = DateTime.UtcNow;
        unit.UpdatedAt = DateTime.UtcNow;

        _context.Units.Add(unit);
        await _context.SaveChangesAsync();

        // Load the unit with faction for response
        await _context.Entry(unit).Reference(u => u.Faction).LoadAsync();

        return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit);
    }

    // PUT: api/Unit/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUnit(int id, Unit unit)
    {
        if (id != unit.Id)
        {
            return BadRequest("ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingUnit = await _context.Units.FindAsync(id);
        if (existingUnit == null)
        {
            return NotFound($"Unit with ID {id} not found.");
        }

        // Verify faction exists
        var faction = await _context.Factions.FindAsync(unit.FactionId);
        if (faction == null)
        {
            return BadRequest($"Faction with ID {unit.FactionId} not found.");
        }

        // Update properties
        existingUnit.Name = unit.Name;
        existingUnit.Description = unit.Description;
        existingUnit.Summary = unit.Summary;
        existingUnit.ImageUrl = unit.ImageUrl;
        existingUnit.PortraitUrl = unit.PortraitUrl;
        existingUnit.AnimationUrl = unit.AnimationUrl;
        existingUnit.FactionId = unit.FactionId;
        existingUnit.Tier = unit.Tier;
        existingUnit.Cost = unit.Cost;
        existingUnit.ResourceCosts = unit.ResourceCosts;
        existingUnit.Attack = unit.Attack;
        existingUnit.Defense = unit.Defense;
        existingUnit.MinDamage = unit.MinDamage;
        existingUnit.MaxDamage = unit.MaxDamage;
        existingUnit.Health = unit.Health;
        existingUnit.Speed = unit.Speed;
        existingUnit.Initiative = unit.Initiative;
        existingUnit.Size = unit.Size;
        existingUnit.UnitType = unit.UnitType;
        existingUnit.IsUpgraded = unit.IsUpgraded;
        existingUnit.BaseUnitId = unit.BaseUnitId;
        existingUnit.SpecialAbilities = unit.SpecialAbilities;
        existingUnit.Immunities = unit.Immunities;
        existingUnit.Resistances = unit.Resistances;
        existingUnit.WeeklyGrowth = unit.WeeklyGrowth;
        existingUnit.BuildingRequirements = unit.BuildingRequirements;
        existingUnit.IsActive = unit.IsActive;
        existingUnit.SortOrder = unit.SortOrder;
        existingUnit.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await UnitExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Unit/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUnit(int id)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit == null)
        {
            return NotFound($"Unit with ID {id} not found.");
        }

        _context.Units.Remove(unit);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> UnitExists(int id)
    {
        return await _context.Units.AnyAsync(u => u.Id == id);
    }
}