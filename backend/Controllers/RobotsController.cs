using Microsoft.AspNetCore.Mvc;

namespace OldenEraFanSite.Api.Controllers
{
    [ApiController]
    [Route("robots.txt")]
    public class RobotsController : ControllerBase
    {
        private readonly string _baseUrl;

        public RobotsController(IConfiguration configuration)
        {
            _baseUrl = configuration["BaseUrl"] ?? "https://oldenera-fansite.netlify.app";
        }

        [HttpGet]
        [Produces("text/plain")]
        public IActionResult GetRobotsTxt()
        {
            var robotsTxt = $@"User-agent: *
Allow: /

# Disallow admin areas
Disallow: /admin/
Disallow: /api/admin/

# Disallow authentication endpoints
Disallow: /api/auth/

# Allow public API endpoints
Allow: /api/news
Allow: /api/factions
Allow: /api/media
Allow: /sitemap.xml

# Sitemap location
Sitemap: {_baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
";

            return Content(robotsTxt, "text/plain");
        }
    }
}