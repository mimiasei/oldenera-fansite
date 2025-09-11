using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedLocalData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed NewsArticles data
            migrationBuilder.Sql(@"
                INSERT INTO ""NewsArticles"" (""Id"", ""Title"", ""Summary"", ""Content"", ""Author"", ""Tags"", ""ImageUrl"", ""IsPublished"", ""PublishedAt"", ""CreatedAt"", ""UpdatedAt"")
                SELECT 1, 'Heroes of Might and Magic: Olden Era Announced', 'The beloved strategy series returns with Heroes of Might and Magic: Olden Era, featuring classic gameplay with modern enhancements.', 'We are excited to announce the upcoming release of Heroes of Might and Magic: Olden Era! This new installment brings back the classic turn-based strategy gameplay that fans have loved for over two decades.

Key features include:
- Classic turn-based combat system
- Multiple unique factions with distinct units and abilities
- Epic single-player campaigns
- Multiplayer battles for up to 8 players
- Beautiful updated graphics while maintaining the classic art style
- Mod support for community content

The development team is committed to delivering an authentic Heroes experience that honors the legacy of the series while introducing modern enhancements and quality-of-life improvements.', 'Development Team', 'announcement,gameplay,features', NULL, true, '2025-09-03 20:12:14.07849+00', '2025-09-03 20:12:14.07849+00', '2025-09-03 20:12:14.07849+00'
                WHERE NOT EXISTS (SELECT 1 FROM ""NewsArticles"" WHERE ""Id"" = 1);

                INSERT INTO ""NewsArticles"" (""Id"", ""Title"", ""Summary"", ""Content"", ""Author"", ""Tags"", ""ImageUrl"", ""IsPublished"", ""PublishedAt"", ""CreatedAt"", ""UpdatedAt"")
                SELECT 2, 'Development Update: Combat System Preview', 'Deep dive into the tactical combat system, featuring hex-based battles and strategic unit positioning.', 'Today we want to share some details about the combat system in Heroes of Might and Magic: Olden Era. We have been working hard to recreate the tactical depth and strategic decision-making that made the original games so engaging.

Combat Features:
- Hex-based battlefield with varied terrain effects
- Unit positioning and facing matter for damage calculations
- Spell casting system with resource management
- Morale and luck factors affecting unit performance
- Special abilities unique to each unit type

We are currently in the playtesting phase, gathering feedback from veteran players to ensure the combat feels both familiar and fresh. More details will be shared as development progresses.', 'Combat Design Team', 'development,combat,gameplay', NULL, true, '2025-09-03 20:12:14.07849+00', '2025-09-03 20:12:14.07849+00', '2025-09-03 20:12:14.07849+00'
                WHERE NOT EXISTS (SELECT 1 FROM ""NewsArticles"" WHERE ""Id"" = 2);

                INSERT INTO ""NewsArticles"" (""Id"", ""Title"", ""Summary"", ""Content"", ""Author"", ""Tags"", ""ImageUrl"", ""IsPublished"", ""PublishedAt"", ""CreatedAt"", ""UpdatedAt"")
                SELECT 3, 'Art Style and Visual Design Philosophy', 'Exploring the art direction and visual philosophy behind the beautiful world of Olden Era.', 'One of our primary goals with Heroes of Might and Magic: Olden Era is to capture the magical atmosphere of the classic games while taking advantage of modern graphics technology.

Our Art Direction:
- Hand-painted textures and environments
- Detailed character and creature designs
- Dynamic lighting and particle effects
- Cinematic spell animations
- UI design that honors the classic aesthetic

We believe that great art direction is about more than just high-resolution graphics. It is about creating a world that feels alive and magical, where every creature, spell, and landscape tells a story. Our artists are working tirelessly to bring this vision to life.', 'Art Team', 'art,design,visuals', NULL, true, '2025-09-03 20:12:14.07849+00', '2025-09-03 20:12:14.07849+00', '2025-09-03 20:12:14.07849+00'
                WHERE NOT EXISTS (SELECT 1 FROM ""NewsArticles"" WHERE ""Id"" = 3);

                -- Update the sequence
                SELECT setval('""NewsArticles_Id_seq""', COALESCE((SELECT MAX(""Id"") FROM ""NewsArticles""), 1));
            ");

            // Seed Factions data
            migrationBuilder.Sql(@"
                INSERT INTO ""Factions"" (""Id"", ""Name"", ""Description"", ""Summary"", ""LogoUrl"", ""BannerUrl"", ""BackgroundUrl"", ""Alignment"", ""Specialty"", ""StartingResources"", ""FactionBonuses"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 1, 'Haven', 'The righteous forces of light, led by knights and angels who fight for justice and honor. Their armies are disciplined and blessed with divine magic.', 'Human faction focused on honor, justice, and divine magic', NULL, NULL, NULL, 'Order', 'Divine Magic and Heavy Cavalry', '{""gold"": 10000, ""wood"": 20, ""ore"": 20}', '{""morale_bonus"": 1, ""spell_power_bonus"": 0}', '2025-09-05 08:38:18.751684', '2025-09-05 08:38:18.751684', true, 1
                WHERE NOT EXISTS (SELECT 1 FROM ""Factions"" WHERE ""Id"" = 1);

                INSERT INTO ""Factions"" (""Id"", ""Name"", ""Description"", ""Summary"", ""LogoUrl"", ""BannerUrl"", ""BackgroundUrl"", ""Alignment"", ""Specialty"", ""StartingResources"", ""FactionBonuses"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 2, 'Necropolis', 'The undead legions commanded by powerful necromancers and death knights. They raise fallen enemies to bolster their ranks and spread terror across the land.', 'Undead faction specializing in necromancy and endless armies', NULL, NULL, NULL, 'Chaos', 'Necromancy and Undead Armies', '{""gold"": 8000, ""wood"": 10, ""ore"": 10, ""mercury"": 5}', '{""necromancy"": true, ""fear_immunity"": true}', '2025-09-05 08:38:18.751684', '2025-09-05 08:38:18.751684', true, 2
                WHERE NOT EXISTS (SELECT 1 FROM ""Factions"" WHERE ""Id"" = 2);

                INSERT INTO ""Factions"" (""Id"", ""Name"", ""Description"", ""Summary"", ""LogoUrl"", ""BannerUrl"", ""BackgroundUrl"", ""Alignment"", ""Specialty"", ""StartingResources"", ""FactionBonuses"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 3, 'Inferno', 'Demons and devils from the burning depths, masters of destructive magic and chaos. Their forces thrive on suffering and destruction.', 'Demonic faction wielding fire magic and chaos', NULL, NULL, NULL, 'Chaos', 'Fire Magic and Demonic Power', '{""gold"": 8000, ""wood"": 5, ""ore"": 5, ""sulfur"": 10}', '{""fire_immunity"": true, ""chaos_bonus"": 2}', '2025-09-05 08:38:18.751684', '2025-09-05 08:38:18.751684', true, 3
                WHERE NOT EXISTS (SELECT 1 FROM ""Factions"" WHERE ""Id"" = 3);

                -- Update the sequence
                SELECT setval('""Factions_Id_seq""', COALESCE((SELECT MAX(""Id"") FROM ""Factions""), 1));
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove seeded data in reverse order
            migrationBuilder.Sql(@"
                DELETE FROM ""NewsArticles"" WHERE ""Id"" IN (1, 2, 3);
                DELETE FROM ""Factions"" WHERE ""Id"" IN (1, 2, 3);
            ");
        }
    }
}
