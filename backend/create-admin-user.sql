-- Create Admin User manually
-- This creates an admin user with email: admin@oldenerafansite.com
-- Password: Admin123! (You should change this after first login)

-- Insert admin user
INSERT INTO "AspNetUsers" (
    "Id", 
    "FirstName", 
    "LastName", 
    "UserName", 
    "NormalizedUserName", 
    "Email", 
    "NormalizedEmail", 
    "EmailConfirmed", 
    "PasswordHash",
    "SecurityStamp",
    "ConcurrencyStamp",
    "PhoneNumberConfirmed",
    "TwoFactorEnabled",
    "LockoutEnabled",
    "AccessFailedCount",
    "CreatedAt",
    "LastLoginAt",
    "IsActive"
) VALUES (
    gen_random_uuid()::text,
    'Admin',
    'User',
    'admin@oldenerafansite.com',
    'ADMIN@OLDENERAFANSITE.COM',
    'admin@oldenerafansite.com',
    'ADMIN@OLDENERAFANSITE.COM',
    true,
    'AQAAAAIAAYagAAAAEKKrLFTqiGgbk5V5UFcKEfY1UJ7BK5h3TjHKG0v0VGG5I0THKhwCtlOTFGq0+lRhLg==', -- Password: Admin123!
    gen_random_uuid()::text,
    gen_random_uuid()::text,
    false,
    false,
    true,
    0,
    NOW(),
    NOW(),
    true
);

-- Assign admin role to the user
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT u."Id", r."Id"
FROM "AspNetUsers" u, "AspNetRoles" r
WHERE u."Email" = 'admin@oldenerafansite.com' 
AND r."Name" = 'Admin';

-- Show the created user
SELECT u."Id", u."Email", u."FirstName", u."LastName", r."Name" as "Role"
FROM "AspNetUsers" u
JOIN "AspNetUserRoles" ur ON u."Id" = ur."UserId"
JOIN "AspNetRoles" r ON ur."RoleId" = r."Id"
WHERE u."Email" = 'admin@oldenerafansite.com';