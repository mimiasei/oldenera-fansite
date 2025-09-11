using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixAdminAvatarPath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Fix admin user avatar path to use existing avatar files
            migrationBuilder.Sql(@"
                UPDATE ""AspNetUsers""
                SET ""ProfilePictureUrl"" = '/images/icons/avatars/Human_01_nobg.webp'
                WHERE ""Email"" = 'admin@oldenerafansite.com' 
                  AND (""ProfilePictureUrl"" = '/images/avatars/human/human_knight_01.webp' 
                       OR ""ProfilePictureUrl"" LIKE '/images/avatars/human/%');
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert admin avatar path to previous value
            migrationBuilder.Sql(@"
                UPDATE ""AspNetUsers""
                SET ""ProfilePictureUrl"" = '/images/avatars/human/human_knight_01.webp'
                WHERE ""Email"" = 'admin@oldenerafansite.com' 
                  AND ""ProfilePictureUrl"" = '/images/icons/avatars/Human_01_nobg.webp';
            ");
        }
    }
}
