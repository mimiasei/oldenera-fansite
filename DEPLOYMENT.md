# Deployment Guide for Render.com

## Prerequisites
- Render.com account
- PostgreSQL database service on Render
- Repository pushed to GitHub

## Backend Deployment Steps

### 1. Create PostgreSQL Database
1. Go to Render Dashboard
2. Create new **PostgreSQL** service
3. Note the **Internal Database URL** (starts with `postgresql://`)
4. Keep the database running

### 2. Deploy ASP.NET Core API
1. Create new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the following:

**Build & Deploy Settings:**
```
Build Command: dotnet publish -c Release -o out
Start Command: cd out && dotnet OldenEraFanSite.Api.dll
```

**Environment Variables:**
```
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL=[Your PostgreSQL Internal Database URL]
JWT_SECRET_KEY=[Generate a secure 256-bit key]
```

### 3. Required Environment Variables

| Variable | Value | Description |
|----------|--------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Sets the runtime environment |
| `DATABASE_URL` | `postgresql://...` | Database connection from Step 1 |
| `JWT_SECRET_KEY` | `[64-char secret]` | Generate using: `openssl rand -base64 64` |

### 4. Generate JWT Secret Key
Run this command locally to generate a secure key:
```bash
openssl rand -base64 64
```

### 5. Database Migration
The application will automatically apply migrations on startup. The migration includes:
- All Identity tables (AspNetUsers, AspNetRoles, etc.)
- Game entities (Factions, Units, Heroes, Spells, etc.)
- Media system (MediaCategories, MediaItems)
- News system (NewsArticles)

## Frontend Deployment (Separate Service)

### 1. Update CORS Configuration
Update the frontend domain in `backend/Program.cs` line 104:
```csharp
corsBuilder.WithOrigins("https://YOUR-FRONTEND-DOMAIN.onrender.com")
```

### 2. Deploy React Frontend
1. Create new **Static Site** on Render
2. Connect your repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/dist`

## Post-Deployment Verification

### 1. Check Database Tables
Verify these tables exist:
- AspNetUsers, AspNetRoles, AspNetUserRoles
- Factions, Units, Heroes, Spells, FactionSpells
- GameInfos, NewsArticles
- MediaCategories, MediaItems

### 2. Test API Endpoints
- `GET /api/news` - Should return empty array
- `GET /api/factions` - Should return empty array
- `GET /api/media/categories` - Should return empty array

### 3. Health Check URLs
- Backend: `https://your-backend.onrender.com/swagger` (in production)
- API Health: `https://your-backend.onrender.com/api/health` (if implemented)

## Troubleshooting

### Database Connection Issues
1. Verify `DATABASE_URL` environment variable
2. Check PostgreSQL service is running
3. Ensure database allows connections from web service

### JWT Authentication Issues
1. Verify `JWT_SECRET_KEY` is set (64+ characters)
2. Check frontend is using correct backend URL
3. Verify CORS policy includes frontend domain

### Migration Failures
1. Check database permissions
2. Verify all Entity Framework packages are installed
3. Check for conflicting table names

## Security Considerations

### Production Settings Applied:
- HTTPS metadata validation enabled
- Secure JWT configuration
- CORS restricted to specific domains
- Connection strings from environment variables

### Additional Recommendations:
1. Use Render's built-in SSL certificates
2. Enable database connection pooling
3. Set up monitoring and logging
4. Configure rate limiting for API endpoints

## Expected Behavior

✅ **Should Work:**
- Database schema creation via migrations
- JWT authentication and authorization
- CRUD operations for all entities
- File upload endpoints (if implemented)
- Role-based access control

⚠️ **May Need Additional Setup:**
- Email sending (requires SMTP configuration)
- File storage (may need cloud storage service)
- Real-time features (SignalR configuration)

## Cost Estimate (Render.com)
- PostgreSQL Database: ~$7/month
- Web Service: $7-25/month (depending on usage)
- Static Site: Free tier available

Total: ~$14-32/month for basic deployment