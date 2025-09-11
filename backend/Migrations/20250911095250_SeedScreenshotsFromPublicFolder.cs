using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedScreenshotsFromPublicFolder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create media categories for screenshots
            migrationBuilder.Sql(@"
                INSERT INTO ""MediaCategories"" (""Id"", ""Name"", ""Description"", ""Slug"", ""Color"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 1, 'Battle Screenshots', 'Epic battle scenes and combat encounters', 'battle', '#8B0000', NOW(), NOW(), true, 1
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaCategories"" WHERE ""Id"" = 1);

                INSERT INTO ""MediaCategories"" (""Id"", ""Name"", ""Description"", ""Slug"", ""Color"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 2, 'Adventure Map', 'Overworld exploration and map views', 'adventure-map', '#228B22', NOW(), NOW(), true, 2
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaCategories"" WHERE ""Id"" = 2);

                INSERT INTO ""MediaCategories"" (""Id"", ""Name"", ""Description"", ""Slug"", ""Color"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 3, 'Towns & Cities', 'Town views and city management screens', 'towns-cities', '#4169E1', NOW(), NOW(), true, 3
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaCategories"" WHERE ""Id"" = 3);

                INSERT INTO ""MediaCategories"" (""Id"", ""Name"", ""Description"", ""Slug"", ""Color"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 4, 'Units & Creatures', 'Character designs and creature abilities', 'units-creatures', '#800080', NOW(), NOW(), true, 4
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaCategories"" WHERE ""Id"" = 4);

                INSERT INTO ""MediaCategories"" (""Id"", ""Name"", ""Description"", ""Slug"", ""Color"", ""CreatedAt"", ""UpdatedAt"", ""IsActive"", ""SortOrder"")
                SELECT 5, 'General Screenshots', 'Various game screenshots and UI elements', 'general', '#FF8C00', NOW(), NOW(), true, 5
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaCategories"" WHERE ""Id"" = 5);

                -- Update the sequence
                SELECT setval('""MediaCategories_Id_seq""', COALESCE((SELECT MAX(""Id"") FROM ""MediaCategories""), 1));
            ");

            // Create media items for existing screenshots
            migrationBuilder.Sql(@"
                -- Battle Screenshots
                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 1, 'Epic Battle Scene', 'Intense combat between powerful armies with spectacular magical effects', 'image', '/images/screenshots/HoMM_Olden_Era_Battle.jpg', '/images/screenshots/HoMM_Olden_Era_Battle.jpg', 1, true, true, true, 0, 1, NOW(), NOW(), 780547
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 1);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 2, 'Strategic Battle Formation', 'Detailed view of unit positioning and battlefield tactics', 'image', '/images/screenshots/HoMM_Olden_Era_Battle1.png', '/images/screenshots/HoMM_Olden_Era_Battle1.png', 1, true, false, true, 0, 2, NOW(), NOW(), 18726796
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 2);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 3, 'Magical Combat Encounter', 'Spellcasters unleashing powerful magic in battle', 'image', '/images/screenshots/HoMM_Olden_Era_Battle2.png', '/images/screenshots/HoMM_Olden_Era_Battle2.png', 1, true, false, true, 0, 3, NOW(), NOW(), 17926826
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 3);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 4, 'Large Scale Battle', 'Massive army confrontation with diverse unit types', 'image', '/images/screenshots/HoMM_Olden_Era_Battle3.png', '/images/screenshots/HoMM_Olden_Era_Battle3.png', 1, true, false, true, 0, 4, NOW(), NOW(), 16194216
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 4);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 5, 'Siege Warfare', 'Tactical siege battles with fortifications', 'image', '/images/screenshots/HoMM_Olden_Era_Sieges.jpg', '/images/screenshots/HoMM_Olden_Era_Sieges.jpg', 1, true, false, true, 0, 5, NOW(), NOW(), 648031
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 5);

                -- Adventure Map Screenshots  
                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 6, 'Adventure Map Overview', 'Expansive world map showing diverse terrains and locations', 'image', '/images/screenshots/HoMM_Olden_Era_Map.jpg', '/images/screenshots/HoMM_Olden_Era_Map.jpg', 2, true, true, true, 0, 1, NOW(), NOW(), 949632
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 6);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 7, 'Detailed Map View', 'Close-up of map features and interactive elements', 'image', '/images/screenshots/HoMM_Olden_Era_Map1.png', '/images/screenshots/HoMM_Olden_Era_Map1.png', 2, true, false, true, 0, 2, NOW(), NOW(), 5034560
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 7);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 8, 'Night Time Exploration', 'Atmospheric nighttime adventure map scenes', 'image', '/images/screenshots/HoMM_Olden_Era_Night.jpg', '/images/screenshots/HoMM_Olden_Era_Night.jpg', 2, true, false, true, 0, 3, NOW(), NOW(), 706738
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 8);

                -- Town Screenshots
                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 9, 'Dungeon Settlement', 'Underground fortress with unique architecture', 'image', '/images/screenshots/HoMM_Olden_Era_Dungeon.png', '/images/screenshots/HoMM_Olden_Era_Dungeon.png', 3, true, false, true, 0, 1, NOW(), NOW(), 6625860
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 9);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 10, 'Necropolis City', 'Dark city of the undead with gothic spires', 'image', '/images/screenshots/HoMM_Olden_Era_Necropolis.png', '/images/screenshots/HoMM_Olden_Era_Necropolis.png', 3, true, true, true, 0, 2, NOW(), NOW(), 5748261
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 10);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 11, 'Forest Settlement', 'Nature-aligned sylvan town in harmony with the woods', 'image', '/images/screenshots/HoMM_Olden_Era_Sylvan.png', '/images/screenshots/HoMM_Olden_Era_Sylvan.png', 3, true, false, true, 0, 3, NOW(), NOW(), 7150236
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 11);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 12, 'Sacred Temple', 'Divine temple complex with holy architecture', 'image', '/images/screenshots/HoMM_Olden_Era_Temple.png', '/images/screenshots/HoMM_Olden_Era_Temple.png', 3, true, false, true, 0, 4, NOW(), NOW(), 7620943
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 12);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 13, 'Insectoid Hive', 'Alien hive structure with organic architecture', 'image', '/images/screenshots/HoMM_Olden_Era_Hive.png', '/images/screenshots/HoMM_Olden_Era_Hive.png', 3, true, false, true, 0, 5, NOW(), NOW(), 6533442
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 13);

                -- Unit & Creature Screenshots
                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 14, 'Angel & Phoenix Armageddon', 'Divine creatures casting devastating spells', 'image', '/images/screenshots/HoMM_Olden_Era_Angel_FlamingPhoenix_Armageddon_(Spell).png', '/images/screenshots/HoMM_Olden_Era_Angel_FlamingPhoenix_Armageddon_(Spell).png', 4, true, true, true, 0, 1, NOW(), NOW(), 3386818
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 14);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 15, 'Bloated Commander Ability', 'Unique unit ability demonstration', 'image', '/images/screenshots/HoMM_Olden_Era__BloatedCommander_(Unit_Ability).png', '/images/screenshots/HoMM_Olden_Era__BloatedCommander_(Unit_Ability).png', 4, true, false, true, 0, 2, NOW(), NOW(), 3427642
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 15);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 16, 'Desert Landscapes', 'Arid terrain and desert environments', 'image', '/images/screenshots/HoMM_Olden_Era__DesertLands.png', '/images/screenshots/HoMM_Olden_Era__DesertLands.png', 5, true, false, true, 0, 1, NOW(), NOW(), 4109022
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 16);

                -- Additional map screenshots
                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 17, 'Strategic Map View 3', 'Tactical overview of terrain and resources', 'image', '/images/screenshots/HoMM_Olden_Era_Map3.png', '/images/screenshots/HoMM_Olden_Era_Map3.png', 2, true, false, true, 0, 4, NOW(), NOW(), 19266027
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 17);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 18, 'Adventure Map 4', 'Diverse landscape with multiple factions', 'image', '/images/screenshots/HoMM_Olden_Era_Map4.png', '/images/screenshots/HoMM_Olden_Era_Map4.png', 2, true, false, true, 0, 5, NOW(), NOW(), 20364554
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 18);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 19, 'Resource Rich Territory', 'Map showing resource distribution and strategic locations', 'image', '/images/screenshots/HoMM_Olden_Era_Map6.png', '/images/screenshots/HoMM_Olden_Era_Map6.png', 2, true, false, true, 0, 6, NOW(), NOW(), 20109838
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 19);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 20, 'Coastal Regions', 'Maritime territories and naval exploration', 'image', '/images/screenshots/HoMM_Olden_Era_Map7.png', '/images/screenshots/HoMM_Olden_Era_Map7.png', 2, true, false, true, 0, 7, NOW(), NOW(), 19939091
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 20);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 21, 'Mountain Territories', 'Highland regions with challenging terrain', 'image', '/images/screenshots/HoMM_Olden_Era_Map8.png', '/images/screenshots/HoMM_Olden_Era_Map8.png', 2, true, false, true, 0, 8, NOW(), NOW(), 13939154
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 21);

                INSERT INTO ""MediaItems"" (""Id"", ""Title"", ""Description"", ""MediaType"", ""OriginalUrl"", ""ThumbnailUrl"", ""CategoryId"", ""IsApproved"", ""IsFeatured"", ""IsActive"", ""ViewCount"", ""SortOrder"", ""CreatedAt"", ""UpdatedAt"", ""FileSize"")
                SELECT 22, 'Epic World Overview', 'Grand scale map showing the entire game world', 'image', '/images/screenshots/HoMM_Olden_Era_Map11.png', '/images/screenshots/HoMM_Olden_Era_Map11.png', 2, true, true, true, 0, 9, NOW(), NOW(), 14258069
                WHERE NOT EXISTS (SELECT 1 FROM ""MediaItems"" WHERE ""Id"" = 22);

                -- Update the sequence
                SELECT setval('""MediaItems_Id_seq""', COALESCE((SELECT MAX(""Id"") FROM ""MediaItems""), 1));
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove seeded media items and categories
            migrationBuilder.Sql(@"
                DELETE FROM ""MediaItems"" WHERE ""Id"" BETWEEN 1 AND 22;
                DELETE FROM ""MediaCategories"" WHERE ""Id"" BETWEEN 1 AND 5;
            ");
        }
    }
}
