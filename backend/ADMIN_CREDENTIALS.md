# Production Admin Credentials

## Seeded Admin User

The production database migration `20250910090948_SeedAdminUser` creates an admin user with the following credentials:

**Email:** `admin@oldenerafansite.com`  
**Password:** `AdminPassword123!`
**Password Hash:** Generated using ASP.NET Core Identity PasswordHasher for secure authentication

## Security Notes

⚠️ **IMPORTANT: Change the default password immediately after first login!**

1. Login with the credentials above
2. Go to User Profile > Edit Profile
3. Change the password to something secure and unique
4. Consider enabling two-factor authentication when available

## User Details

- **Name:** Site Administrator
- **Roles:** Admin (full access)
- **Avatar:** Human Knight (fantasy-themed)
- **Email Confirmed:** Yes
- **Account Status:** Active

## Migration Behavior

- The initial migration (`SeedAdminUser`) only creates the admin user if it doesn't already exist
- The update migration (`UpdateAdminPasswordHash`) fixes invalid password hashes for existing admin users
- Safe to run multiple times without creating duplicates or breaking existing data
- Creates Admin, Moderator, and User roles if they don't exist
- Assigns Admin role to the seeded user automatically
- Automatically corrects any invalid Base64 password hashes that cause authentication failures

## Production Deployment

When these migrations run in production:

**SeedAdminUser Migration:**
1. Check if admin user exists
2. If not, create the user with roles and proper password hash
3. Display success message in logs
4. If user exists, skip creation and display skip message

**UpdateAdminPasswordHash Migration:**
1. Check if admin user exists with invalid password hash
2. Update password hash if current hash is invalid/missing/too short
3. Display update success message in logs
4. If password hash is already correct, skip update

This ensures the production site has immediate admin access with working authentication for site management.