# Production Admin Credentials

## Seeded Admin User

The production database migration `20250910090948_SeedAdminUser` creates an admin user with the following credentials:

**Email:** `admin@oldenerafansite.com`  
**Password:** `AdminPassword123!`

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

- The migration only creates the admin user if it doesn't already exist
- Safe to run multiple times without creating duplicates
- Creates Admin, Moderator, and User roles if they don't exist
- Assigns Admin role to the seeded user automatically

## Production Deployment

When this migration runs in production:
1. Check if admin user exists
2. If not, create the user with roles
3. Display success message in logs
4. If user exists, skip creation and display skip message

This ensures the production site has immediate admin access for site management.