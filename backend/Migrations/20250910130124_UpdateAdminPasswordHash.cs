using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminPasswordHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update existing admin user with correct password hash
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    -- Update admin user password hash if user exists with old invalid hash
                    UPDATE ""AspNetUsers"" 
                    SET ""PasswordHash"" = 'AQAAAAIAAYagAAAAEOKUWBR34/HRIkyVInAOcbLVtOSjavm9sH/oj8c/momeHCEeYr2tVYu+fdEE8JRiLA=='
                    WHERE ""Email"" = 'admin@oldenerafansite.com'
                      AND (""PasswordHash"" IS NULL 
                           OR ""PasswordHash"" = 'AQAAAAIAAYagAAAAEHqZVKJxGvq8zBq8YjH1F6kF9Q9gN7Yx1pR6+xT4J2Mn8vL5zK9wA1sD3fG6hI7jK0l'
                           OR LENGTH(""PasswordHash"") < 50);  -- Invalid/short hash

                    IF FOUND THEN
                        RAISE NOTICE 'Admin user password hash updated successfully';
                    ELSE
                        RAISE NOTICE 'Admin user not found or password hash already correct';
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Note: Cannot reliably rollback password hash changes
            // This migration is generally safe and should not need rollback
            // If rollback is needed, admin password should be reset manually
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    RAISE NOTICE 'Password hash update cannot be automatically rolled back.';
                    RAISE NOTICE 'If needed, reset admin password manually through admin interface.';
                END $$;
            ");
        }
    }
}
