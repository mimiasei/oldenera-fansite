# Environment Variables Setup

## Local Development

1. **Create .env file**: Copy `.env.example` to `.env` in the backend directory:
   ```bash
   cp .env.example .env
   ```

2. **Fill in real values**:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://postgres:password@localhost:5432/oldenerafansite
   
   # JWT Configuration  
   JWT_SECRET_KEY=your-88-character-base64-jwt-secret-key-here
   JWT_ISSUER=https://localhost:5001
   JWT_AUDIENCE=oldenerafansite-client
   
   # Environment
   ASPNETCORE_ENVIRONMENT=Development
   ```

3. **Generate JWT Secret Key**:
   ```bash
   openssl rand -base64 64
   ```

## Render.com Production Setup

### Method 1: Environment Variables (Recommended)

1. **Go to your Render service dashboard**
2. **Click "Environment" tab**
3. **Add the following environment variables**:

   | Key | Value | Notes |
   |-----|-------|--------|
   | `DATABASE_URL` | `postgresql://user:pass@host:port/db` | Auto-provided by Render PostgreSQL |
   | `JWT_SECRET_KEY` | `[64-char base64 string]` | Generate with `openssl rand -base64 64` |
   | `JWT_ISSUER` | `https://your-app.onrender.com` | Your actual Render app URL |
   | `JWT_AUDIENCE` | `oldenerafansite-client` | Client application identifier |
   | `ASPNETCORE_ENVIRONMENT` | `Production` | Set to Production |

4. **Redeploy your service** after adding environment variables

### Method 2: Render Environment Groups (Alternative)

1. **Create Environment Group**:
   - Go to Render Dashboard → Environment Groups
   - Click "New Environment Group"
   - Name it "OldenEra-Production"

2. **Add variables to the group**:
   - Same variables as Method 1

3. **Link to your service**:
   - Go to your service → Environment tab
   - Click "Link Environment Group"
   - Select "OldenEra-Production"

## Security Best Practices

1. **Never commit secrets**: The `.env` file is in `.gitignore` - keep it that way!
2. **Use strong JWT secrets**: Minimum 64 characters, generated randomly
3. **Different secrets per environment**: Use different keys for development/production
4. **Rotate secrets regularly**: Update JWT keys periodically
5. **Remove temporary hardcoded secrets**: Clean up `appsettings.Production.json` after .env setup

## Verification

The application will log startup messages indicating successful configuration:
```
✓ .env file loaded for local development
Database connection configured: 123 characters
✓ JWT configuration loaded
```

## Troubleshooting

- **"JWT_SECRET_KEY environment variable not configured"**: Ensure the variable exists in Render environment
- **"Database connection string not found"**: Check `DATABASE_URL` is set correctly
- **Variables not loading**: Redeploy service after adding environment variables
- **Local .env not working**: Ensure file is named exactly `.env` (not `.env.txt`)