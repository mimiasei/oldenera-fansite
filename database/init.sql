-- Database initialization script for Docker PostgreSQL
-- This script runs automatically when the container starts

-- Create news articles table
CREATE TABLE IF NOT EXISTS "NewsArticles" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Content" TEXT NOT NULL,
    "Summary" VARCHAR(500) NOT NULL DEFAULT '',
    "PublishedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "IsPublished" BOOLEAN NOT NULL DEFAULT true,
    "Author" VARCHAR(100) NOT NULL DEFAULT 'Admin',
    "ImageUrl" TEXT,
    "Tags" TEXT NOT NULL DEFAULT ''
);

-- Insert sample data
INSERT INTO "NewsArticles" ("Title", "Content", "Summary", "Author", "Tags") VALUES
(
    'Heroes of Might and Magic: Olden Era Announced', 
    'We are excited to announce the upcoming release of Heroes of Might and Magic: Olden Era! This new installment brings back the classic turn-based strategy gameplay that fans have loved for over two decades.

    Key features include:
    - Classic turn-based combat system
    - Multiple unique factions with distinct units and abilities  
    - Epic single-player campaigns
    - Multiplayer battles for up to 8 players
    - Beautiful updated graphics while maintaining the classic art style
    - Mod support for community content

    The development team is committed to delivering an authentic Heroes experience that honors the legacy of the series while introducing modern enhancements and quality-of-life improvements.',
    'The beloved strategy series returns with Heroes of Might and Magic: Olden Era, featuring classic gameplay with modern enhancements.',
    'Development Team',
    'announcement,gameplay,features'
),
(
    'Development Update: Combat System Preview',
    'Today we want to share some details about the combat system in Heroes of Might and Magic: Olden Era. We have been working hard to recreate the tactical depth and strategic decision-making that made the original games so engaging.

    Combat Features:
    - Hex-based battlefield with varied terrain effects
    - Unit positioning and facing matter for damage calculations
    - Spell casting system with resource management
    - Morale and luck factors affecting unit performance
    - Special abilities unique to each unit type

    We are currently in the playtesting phase, gathering feedback from veteran players to ensure the combat feels both familiar and fresh. More details will be shared as development progresses.',
    'Deep dive into the tactical combat system, featuring hex-based battles and strategic unit positioning.',
    'Combat Design Team',
    'development,combat,gameplay'
),
(
    'Art Style and Visual Design Philosophy',
    'One of our primary goals with Heroes of Might and Magic: Olden Era is to capture the magical atmosphere of the classic games while taking advantage of modern graphics technology.

    Our Art Direction:
    - Hand-painted textures and environments
    - Detailed character and creature designs
    - Dynamic lighting and particle effects
    - Cinematic spell animations
    - UI design that honors the classic aesthetic

    We believe that great art direction is about more than just high-resolution graphics. It is about creating a world that feels alive and magical, where every creature, spell, and landscape tells a story. Our artists are working tirelessly to bring this vision to life.',
    'Exploring the art direction and visual philosophy behind the beautiful world of Olden Era.',
    'Art Team',
    'art,design,visuals'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IX_NewsArticles_PublishedAt" ON "NewsArticles" ("PublishedAt" DESC);
CREATE INDEX IF NOT EXISTS "IX_NewsArticles_IsPublished" ON "NewsArticles" ("IsPublished");

-- Set up update trigger for UpdatedAt column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_articles_updated_at 
    BEFORE UPDATE ON "NewsArticles" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create media categories table
CREATE TABLE IF NOT EXISTS "MediaCategories" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Description" VARCHAR(500) NOT NULL DEFAULT '',
    "Slug" VARCHAR(100) NOT NULL UNIQUE,
    "IconUrl" TEXT,
    "ThumbnailUrl" TEXT,
    "Color" VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "SortOrder" INTEGER NOT NULL DEFAULT 0
);

-- Create media items table
CREATE TABLE IF NOT EXISTS "MediaItems" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(1000) NOT NULL DEFAULT '',
    "MediaType" VARCHAR(50) NOT NULL,
    "OriginalUrl" TEXT NOT NULL,
    "ThumbnailUrl" TEXT,
    "LargeUrl" TEXT,
    "OriginalFileName" VARCHAR(100),
    "FileSize" BIGINT NOT NULL DEFAULT 0,
    "Width" INTEGER,
    "Height" INTEGER,
    "Tags" TEXT,
    "AltText" TEXT,
    "Caption" TEXT,
    "CategoryId" INTEGER NOT NULL REFERENCES "MediaCategories"("Id") ON DELETE CASCADE,
    "FactionId" INTEGER REFERENCES "Factions"("Id") ON DELETE SET NULL,
    "UploadedByUserId" VARCHAR(450) REFERENCES "AspNetUsers"("Id") ON DELETE SET NULL,
    "IsApproved" BOOLEAN NOT NULL DEFAULT true,
    "IsFeatured" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "ViewCount" INTEGER NOT NULL DEFAULT 0,
    "SortOrder" INTEGER NOT NULL DEFAULT 0
);

-- Insert sample media categories
INSERT INTO "MediaCategories" ("Name", "Description", "Slug", "Color", "SortOrder") VALUES
('Screenshots', 'Gameplay screenshots and in-game scenes', 'screenshots', '#10B981', 1),
('Concept Art', 'Early concept art and development sketches', 'concept-art', '#8B5CF6', 2),
('Character Art', 'Heroes, units, and character designs', 'character-art', '#F59E0B', 3),
('Environment Art', 'Maps, landscapes, and world environments', 'environment-art', '#06B6D4', 4),
('UI Screenshots', 'User interface and menu screenshots', 'ui-screenshots', '#EF4444', 5),
('Wallpapers', 'High-resolution wallpapers and promotional art', 'wallpapers', '#EC4899', 6);

-- Insert sample media items (using placeholder URLs - in production these would be real image URLs)
INSERT INTO "MediaItems" ("Title", "Description", "MediaType", "OriginalUrl", "ThumbnailUrl", "CategoryId", "Width", "Height", "AltText", "IsFeatured", "ViewCount") VALUES
('Main Menu Interface', 'The redesigned main menu featuring the classic Heroes aesthetic', 'image', '/images/screenshots/main-menu.jpg', '/images/screenshots/thumbs/main-menu-thumb.jpg', 1, 1920, 1080, 'Heroes of Might and Magic Olden Era main menu screen', true, 245),
('Haven Town Screen', 'Overview of the Haven faction town with all buildings visible', 'image', '/images/screenshots/haven-town.jpg', '/images/screenshots/thumbs/haven-town-thumb.jpg', 1, 1920, 1080, 'Haven faction town screen showing castle and buildings', true, 189),
('Combat Interface', 'Turn-based combat showing the tactical battle grid', 'image', '/images/screenshots/combat-battle.jpg', '/images/screenshots/thumbs/combat-battle-thumb.jpg', 1, 1920, 1080, 'Combat screen with units positioned on battlefield', false, 167),
('World Map View', 'Adventure map showing exploration and resource gathering', 'image', '/images/screenshots/world-map.jpg', '/images/screenshots/thumbs/world-map-thumb.jpg', 1, 1920, 1080, 'Adventure map with hero exploring the world', false, 134),
('Hero Portrait - Paladin', 'Early concept art for the Haven Paladin hero class', 'image', '/images/concept/paladin-hero.jpg', '/images/concept/thumbs/paladin-hero-thumb.jpg', 2, 800, 1000, 'Concept art of a Paladin hero in shining armor', true, 298),
('Dragon Knight Concept', 'Concept design for the powerful Dragon Knight unit', 'image', '/images/concept/dragon-knight.jpg', '/images/concept/thumbs/dragon-knight-thumb.jpg', 3, 1024, 768, 'Concept art of Dragon Knight unit with detailed armor', false, 156),
('Necropolis Castle', 'Environmental art showing the dark Necropolis faction castle', 'image', '/images/environment/necropolis-castle.jpg', '/images/environment/thumbs/necropolis-castle-thumb.jpg', 4, 1920, 1080, 'Dark and foreboding Necropolis castle environment', true, 212),
('Spell Selection UI', 'User interface for selecting and casting spells in combat', 'image', '/images/ui/spell-interface.jpg', '/images/ui/thumbs/spell-interface-thumb.jpg', 5, 1920, 1080, 'Spell casting interface with magic school icons', false, 89),
('Official Game Wallpaper', 'High-resolution promotional wallpaper featuring all factions', 'image', '/images/wallpapers/faction-wallpaper.jpg', '/images/wallpapers/thumbs/faction-wallpaper-thumb.jpg', 6, 2560, 1440, 'Epic wallpaper showing heroes from all game factions', true, 567);

-- Create indexes for media tables
CREATE INDEX IF NOT EXISTS "IX_MediaCategories_Slug" ON "MediaCategories" ("Slug");
CREATE INDEX IF NOT EXISTS "IX_MediaCategories_Name" ON "MediaCategories" ("Name");
CREATE INDEX IF NOT EXISTS "IX_MediaItems_CategoryId_CreatedAt" ON "MediaItems" ("CategoryId", "CreatedAt" DESC);
CREATE INDEX IF NOT EXISTS "IX_MediaItems_MediaType" ON "MediaItems" ("MediaType");
CREATE INDEX IF NOT EXISTS "IX_MediaItems_IsFeatured" ON "MediaItems" ("IsFeatured");
CREATE INDEX IF NOT EXISTS "IX_MediaItems_IsApproved" ON "MediaItems" ("IsApproved");
CREATE INDEX IF NOT EXISTS "IX_MediaItems_FactionId" ON "MediaItems" ("FactionId");

-- Create update triggers for media tables
CREATE TRIGGER update_media_categories_updated_at 
    BEFORE UPDATE ON "MediaCategories" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_items_updated_at 
    BEFORE UPDATE ON "MediaItems" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();