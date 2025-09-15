using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using System.Text;
using System.Xml;

namespace OldenEraFanSite.Api.Controllers
{
    [ApiController]
    [Route("sitemap.xml")]
    public class SitemapController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _baseUrl;

        public SitemapController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _baseUrl = configuration["BaseUrl"] ?? "https://oldenera-fansite.netlify.app";
        }

        [HttpGet]
        [Produces("application/xml")]
        public async Task<IActionResult> GetSitemap()
        {
            var sitemap = new StringBuilder();

            sitemap.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sitemap.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

            // Add static pages
            AddUrl(sitemap, "", "1.0", "daily", DateTime.UtcNow); // Home
            AddUrl(sitemap, "news", "0.9", "daily", DateTime.UtcNow);
            AddUrl(sitemap, "factions", "0.8", "weekly", DateTime.UtcNow);
            AddUrl(sitemap, "screenshots", "0.7", "weekly", DateTime.UtcNow);
            AddUrl(sitemap, "forum", "0.6", "weekly", DateTime.UtcNow);

            // Add news articles
            var newsArticles = await _context.NewsArticles
                .Where(n => n.IsPublished)
                .Select(n => new { n.Id, n.UpdatedAt })
                .ToListAsync();

            foreach (var article in newsArticles)
            {
                AddUrl(sitemap, $"news/{article.Id}", "0.8", "monthly", article.UpdatedAt);
            }

            // Add factions
            var factions = await _context.Factions
                .Select(f => new { f.Id, f.UpdatedAt })
                .ToListAsync();

            foreach (var faction in factions)
            {
                AddUrl(sitemap, $"factions/{faction.Id}", "0.7", "monthly", faction.UpdatedAt);
            }

            sitemap.AppendLine("</urlset>");

            return Content(sitemap.ToString(), "application/xml", Encoding.UTF8);
        }

        private void AddUrl(StringBuilder sitemap, string path, string priority, string changefreq, DateTime lastmod)
        {
            var url = string.IsNullOrEmpty(path) ? _baseUrl : $"{_baseUrl}/{path}";

            sitemap.AppendLine("  <url>");
            sitemap.AppendLine($"    <loc>{XmlEscape(url)}</loc>");
            sitemap.AppendLine($"    <lastmod>{lastmod:yyyy-MM-dd}</lastmod>");
            sitemap.AppendLine($"    <changefreq>{changefreq}</changefreq>");
            sitemap.AppendLine($"    <priority>{priority}</priority>");
            sitemap.AppendLine("  </url>");
        }

        private static string XmlEscape(string input)
        {
            return input.Replace("&", "&amp;")
                       .Replace("<", "&lt;")
                       .Replace(">", "&gt;")
                       .Replace("\"", "&quot;")
                       .Replace("'", "&apos;");
        }
    }
}