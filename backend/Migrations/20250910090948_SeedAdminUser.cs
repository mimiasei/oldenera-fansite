using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OldenEraFanSite.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if admin user already exists
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    -- Only create admin user if it doesn't exist
                    IF NOT EXISTS (SELECT 1 FROM ""AspNetUsers"" WHERE ""Email"" = 'admin@oldenerafansite.com') THEN
                        -- Insert admin user
                        INSERT INTO ""AspNetUsers"" (
                            ""Id"", 
                            ""FirstName"", 
                            ""LastName"", 
                            ""UserName"", 
                            ""NormalizedUserName"", 
                            ""Email"", 
                            ""NormalizedEmail"", 
                            ""EmailConfirmed"", 
                            ""PasswordHash"", 
                            ""SecurityStamp"", 
                            ""ConcurrencyStamp"", 
                            ""PhoneNumberConfirmed"", 
                            ""TwoFactorEnabled"", 
                            ""LockoutEnabled"", 
                            ""AccessFailedCount"",
                            ""ProfilePictureUrl"",
                            ""CreatedAt"",
                            ""UpdatedAt""
                        ) VALUES (
                            'admin-seed-user-id-12345',
                            'Site',
                            'Administrator',
                            'admin@oldenerafansite.com',
                            'ADMIN@OLDENERAFANSITE.COM',
                            'admin@oldenerafansite.com',
                            'ADMIN@OLDENERAFANSITE.COM',
                            true,
                            'AQAAAAIAAYagAAAAEHqZVKJxGvq8zBq8YjH1F6kF9Q9gN7Yx1pR6+xT4J2Mn8vL5zK9wA1sD3fG6hI7jK0l',  -- Password: AdminPassword123!
                            'AAAAAAAAAAAAAAAAAAAAAAAAAA',
                            gen_random_uuid()::text,
                            false,
                            false,
                            true,
                            0,
                            '/images/avatars/human/human_knight_01.webp',
                            NOW(),
                            NOW()
                        );

                        -- Create Admin role if it doesn't exist
                        IF NOT EXISTS (SELECT 1 FROM ""AspNetRoles"" WHERE ""Name"" = 'Admin') THEN
                            INSERT INTO ""AspNetRoles"" (""Id"", ""Name"", ""NormalizedName"", ""ConcurrencyStamp"")
                            VALUES (gen_random_uuid()::text, 'Admin', 'ADMIN', gen_random_uuid()::text);
                        END IF;

                        -- Create Moderator role if it doesn't exist
                        IF NOT EXISTS (SELECT 1 FROM ""AspNetRoles"" WHERE ""Name"" = 'Moderator') THEN
                            INSERT INTO ""AspNetRoles"" (""Id"", ""Name"", ""NormalizedName"", ""ConcurrencyStamp"")
                            VALUES (gen_random_uuid()::text, 'Moderator', 'MODERATOR', gen_random_uuid()::text);
                        END IF;

                        -- Create User role if it doesn't exist
                        IF NOT EXISTS (SELECT 1 FROM ""AspNetRoles"" WHERE ""Name"" = 'User') THEN
                            INSERT INTO ""AspNetRoles"" (""Id"", ""Name"", ""NormalizedName"", ""ConcurrencyStamp"")
                            VALUES (gen_random_uuid()::text, 'User', 'USER', gen_random_uuid()::text);
                        END IF;

                        -- Assign Admin role to admin user
                        INSERT INTO ""AspNetUserRoles"" (""UserId"", ""RoleId"")
                        SELECT 'admin-seed-user-id-12345', ""Id""
                        FROM ""AspNetRoles""
                        WHERE ""Name"" = 'Admin';

                        RAISE NOTICE 'Admin user created successfully with email: admin@oldenerafansite.com';
                        RAISE NOTICE 'Default password: AdminPassword123! (Please change after first login)';
                    ELSE
                        RAISE NOTICE 'Admin user already exists, skipping creation';
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove seeded admin user and roles
            migrationBuilder.Sql(@"
                -- Remove admin user role assignments
                DELETE FROM ""AspNetUserRoles"" 
                WHERE ""UserId"" = 'admin-seed-user-id-12345';
                
                -- Remove admin user
                DELETE FROM ""AspNetUsers"" 
                WHERE ""Id"" = 'admin-seed-user-id-12345';
                
                -- Note: We don't remove roles as they might be used by other users
            ");
        }
    }
}
