using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixMediaUrlPathsForProduction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Fix media URLs to point to correct backend wwwroot location
            // Convert any frontend/public paths to backend wwwroot paths
            migrationBuilder.Sql(@"
                UPDATE ""MediaItems"" 
                SET ""OriginalUrl"" = REPLACE(""OriginalUrl"", '/frontend/public/images/', '/images/')
                WHERE ""OriginalUrl"" LIKE '%/frontend/public/images/%';
            ");
            
            // Ensure all paths start with /images/ for backend serving
            migrationBuilder.Sql(@"
                UPDATE ""MediaItems"" 
                SET ""OriginalUrl"" = CASE 
                    WHEN ""OriginalUrl"" NOT LIKE '/images/%' AND ""OriginalUrl"" LIKE '%/screenshots/%' 
                    THEN '/images/screenshots/' || SUBSTRING(""OriginalUrl"" FROM '[^/]+$')
                    ELSE ""OriginalUrl""
                END
                WHERE ""OriginalUrl"" IS NOT NULL;
            ");
            
            // Log the update for verification
            migrationBuilder.Sql(@"
                DO $$
                DECLARE
                    updated_count INTEGER;
                BEGIN
                    SELECT COUNT(*) INTO updated_count FROM ""MediaItems"" WHERE ""OriginalUrl"" LIKE '/images/%';
                    RAISE NOTICE 'Fixed % MediaItems OriginalUrl paths for backend serving', updated_count;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This rollback is complex since we don't know the original paths
            // Just log that a rollback was attempted
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    RAISE NOTICE 'MediaItems URL path rollback attempted - manual verification may be needed';
                END $$;
            ");
        }
    }
}