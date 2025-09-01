# Backend Static Files

This directory contains static files served by the ASP.NET Core backend.

## Structure

- **uploads/news/** - User-uploaded images for news articles
- **static/images/** - Backend-managed static images

## Usage

Configure static file serving in Program.cs:

```csharp
app.UseStaticFiles(); // Serves files from wwwroot
```

Files are accessible via:
- `https://localhost:5001/uploads/news/article-image.jpg`
- `https://localhost:5001/static/images/default-avatar.png`

## Security Considerations

- Validate file types on upload
- Limit file sizes
- Scan for malware
- Use proper file permissions
- Consider serving from CDN in production