-- Add Game Content Tables for Heroes of Might and Magic: Olden Era Fan Site
-- Execute this script to add game content tables to the existing database

-- Factions table
CREATE TABLE IF NOT EXISTS "Factions" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "Summary" VARCHAR(500),
    "LogoUrl" TEXT,
    "BannerUrl" TEXT,
    "BackgroundUrl" TEXT,
    "Alignment" VARCHAR(50),
    "Specialty" VARCHAR(200),
    "StartingResources" TEXT, -- JSON
    "FactionBonuses" TEXT, -- JSON
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "SortOrder" INTEGER NOT NULL DEFAULT 0
);

-- Create unique index on faction name
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Factions_Name" ON "Factions" ("Name");

-- Units table
CREATE TABLE IF NOT EXISTS "Units" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "Summary" VARCHAR(300),
    "ImageUrl" TEXT,
    "PortraitUrl" TEXT,
    "AnimationUrl" TEXT,
    "FactionId" INTEGER NOT NULL,
    "Tier" INTEGER NOT NULL DEFAULT 1,
    "Cost" INTEGER NOT NULL DEFAULT 0,
    "ResourceCosts" TEXT, -- JSON
    "Attack" INTEGER NOT NULL DEFAULT 0,
    "Defense" INTEGER NOT NULL DEFAULT 0,
    "MinDamage" INTEGER NOT NULL DEFAULT 0,
    "MaxDamage" INTEGER NOT NULL DEFAULT 0,
    "Health" INTEGER NOT NULL DEFAULT 0,
    "Speed" INTEGER NOT NULL DEFAULT 0,
    "Initiative" INTEGER NOT NULL DEFAULT 0,
    "Size" VARCHAR(20),
    "UnitType" VARCHAR(50),
    "IsUpgraded" BOOLEAN NOT NULL DEFAULT FALSE,
    "BaseUnitId" INTEGER,
    "SpecialAbilities" TEXT, -- JSON
    "Immunities" TEXT, -- JSON
    "Resistances" TEXT, -- JSON
    "WeeklyGrowth" INTEGER NOT NULL DEFAULT 0,
    "BuildingRequirements" TEXT, -- JSON
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "SortOrder" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("FactionId") REFERENCES "Factions"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("BaseUnitId") REFERENCES "Units"("Id") ON DELETE RESTRICT
);

-- Create indexes for units
CREATE INDEX IF NOT EXISTS "IX_Units_FactionId_Name" ON "Units" ("FactionId", "Name");

-- Spells table
CREATE TABLE IF NOT EXISTS "Spells" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "Summary" VARCHAR(300),
    "IconUrl" TEXT,
    "EffectUrl" TEXT,
    "School" VARCHAR(50) NOT NULL,
    "Level" INTEGER NOT NULL DEFAULT 1,
    "ManaCost" INTEGER NOT NULL DEFAULT 0,
    "BasePower" INTEGER NOT NULL DEFAULT 0,
    "Type" VARCHAR(50),
    "Target" VARCHAR(50),
    "Duration" VARCHAR(50),
    "Effects" TEXT, -- JSON
    "Requirements" TEXT, -- JSON
    "IsCommon" BOOLEAN NOT NULL DEFAULT TRUE,
    "RequiredSkillLevel" INTEGER NOT NULL DEFAULT 0,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "SortOrder" INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for spells
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Spells_Name" ON "Spells" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Spells_School_Level" ON "Spells" ("School", "Level");

-- FactionSpells junction table
CREATE TABLE IF NOT EXISTS "FactionSpells" (
    "Id" SERIAL PRIMARY KEY,
    "FactionId" INTEGER NOT NULL,
    "SpellId" INTEGER NOT NULL,
    "IsSignatureSpell" BOOLEAN NOT NULL DEFAULT FALSE,
    "ModifiedManaCost" INTEGER,
    "FactionModifications" TEXT, -- JSON
    FOREIGN KEY ("FactionId") REFERENCES "Factions"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("SpellId") REFERENCES "Spells"("Id") ON DELETE CASCADE
);

-- Create unique index on faction-spell combination
CREATE UNIQUE INDEX IF NOT EXISTS "IX_FactionSpells_FactionId_SpellId" ON "FactionSpells" ("FactionId", "SpellId");

-- Heroes table
CREATE TABLE IF NOT EXISTS "Heroes" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Biography" TEXT NOT NULL,
    "Summary" VARCHAR(300),
    "PortraitUrl" TEXT,
    "FullImageUrl" TEXT,
    "FactionId" INTEGER NOT NULL,
    "HeroClass" VARCHAR(50) NOT NULL,
    "HeroType" VARCHAR(50),
    "StartingAttack" INTEGER NOT NULL DEFAULT 0,
    "StartingDefense" INTEGER NOT NULL DEFAULT 0,
    "StartingSpellPower" INTEGER NOT NULL DEFAULT 0,
    "StartingKnowledge" INTEGER NOT NULL DEFAULT 0,
    "Specialty" VARCHAR(100),
    "SpecialtyDescription" TEXT,
    "SpecialtyEffects" TEXT, -- JSON
    "StartingSkills" TEXT, -- JSON
    "StartingSpells" TEXT, -- JSON
    "StartingArtifacts" TEXT, -- JSON
    "PreferredTerrain" TEXT, -- JSON
    "RarityLevel" INTEGER NOT NULL DEFAULT 1,
    "Title" VARCHAR(100),
    "Background" TEXT,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "SortOrder" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("FactionId") REFERENCES "Factions"("Id") ON DELETE CASCADE
);

-- Create index for heroes
CREATE INDEX IF NOT EXISTS "IX_Heroes_FactionId_Name" ON "Heroes" ("FactionId", "Name");

-- GameInfos table
CREATE TABLE IF NOT EXISTS "GameInfos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL,
    "Content" TEXT NOT NULL,
    "Summary" VARCHAR(300),
    "Category" VARCHAR(50) NOT NULL,
    "Slug" VARCHAR(100),
    "BannerUrl" TEXT,
    "IconUrl" TEXT,
    "ImageUrls" TEXT, -- Comma-separated list
    "SortOrder" INTEGER NOT NULL DEFAULT 0,
    "IsPublished" BOOLEAN NOT NULL DEFAULT TRUE,
    "IsFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
    "MetaDescription" TEXT,
    "Tags" TEXT, -- Comma-separated list
    "RelatedFactionIds" TEXT, -- Comma-separated list of IDs
    "RelatedGameInfoIds" TEXT, -- Comma-separated list of IDs
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "Author" VARCHAR(100) NOT NULL DEFAULT 'Admin'
);

-- Create indexes for game info
CREATE UNIQUE INDEX IF NOT EXISTS "IX_GameInfos_Slug" ON "GameInfos" ("Slug");
CREATE INDEX IF NOT EXISTS "IX_GameInfos_Category_SortOrder" ON "GameInfos" ("Category", "SortOrder");

-- Create trigger function for updating UpdatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_factions_updated_at BEFORE UPDATE ON "Factions" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON "Units" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spells_updated_at BEFORE UPDATE ON "Spells" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON "Heroes" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gameinfos_updated_at BEFORE UPDATE ON "GameInfos" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample faction data
INSERT INTO "Factions" ("Name", "Description", "Summary", "Alignment", "Specialty", "SortOrder", "StartingResources", "FactionBonuses") VALUES
('Haven', 'The righteous forces of light, led by knights and angels who fight for justice and honor. Their armies are disciplined and blessed with divine magic.', 'Human faction focused on honor, justice, and divine magic', 'Order', 'Divine Magic and Heavy Cavalry', 1, '{"gold": 10000, "wood": 20, "ore": 20}', '{"morale_bonus": 1, "spell_power_bonus": 0}'),
('Necropolis', 'The undead legions commanded by powerful necromancers and death knights. They raise fallen enemies to bolster their ranks and spread terror across the land.', 'Undead faction specializing in necromancy and endless armies', 'Chaos', 'Necromancy and Undead Armies', 2, '{"gold": 8000, "wood": 10, "ore": 10, "mercury": 5}', '{"necromancy": true, "fear_immunity": true}'),
('Inferno', 'Demons and devils from the burning depths, masters of destructive magic and chaos. Their forces thrive on suffering and destruction.', 'Demonic faction wielding fire magic and chaos', 'Chaos', 'Fire Magic and Demonic Power', 3, '{"gold": 8000, "wood": 5, "ore": 5, "sulfur": 10}', '{"fire_immunity": true, "chaos_bonus": 2}');

COMMIT;