using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOriginalUrlsToWebP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update PNG references to WebP in OriginalUrl
            migrationBuilder.Sql(@"
                UPDATE ""MediaItems"" 
                SET ""OriginalUrl"" = REPLACE(""OriginalUrl"", '.png', '.webp')
                WHERE ""OriginalUrl"" LIKE '%.png';
            ");
            
            // Log the update for verification
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    RAISE NOTICE 'Updated MediaItems OriginalUrl from PNG to WebP format';
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Rollback: Change WebP back to PNG
            migrationBuilder.Sql(@"
                UPDATE ""MediaItems"" 
                SET ""OriginalUrl"" = REPLACE(""OriginalUrl"", '.webp', '.png')
                WHERE ""OriginalUrl"" LIKE '%.webp';
            ");
        }
    }
}