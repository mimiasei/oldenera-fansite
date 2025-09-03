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