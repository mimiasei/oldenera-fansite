using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;

namespace OldenEraFanSite.Api.Commands;

public class ListMediaCommand : ICommand
{
    private readonly IServiceProvider _serviceProvider;

    public string Name => "list-media";
    public string Description => "List media items and their thumbnail status";

    public ListMediaCommand(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<int> ExecuteAsync(string[] args)
    {
        Console.WriteLine("📋 Listing media items...");

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var options = ParseArguments(args);

            var query = context.MediaItems
                .Include(m => m.Category)
                .Where(m => m.MediaType == "image" && m.IsActive);

            if (!options.ShowAll)
            {
                query = query.Where(m => string.IsNullOrEmpty(m.ThumbnailWebpUrl) || string.IsNullOrEmpty(m.LargeWebpUrl));
            }

            var mediaItems = await query
                .OrderBy(m => m.Id)
                .ToListAsync();

            if (!mediaItems.Any())
            {
                if (options.ShowAll)
                {
                    Console.WriteLine("✅ No media items found.");
                }
                else
                {
                    Console.WriteLine("✅ All media items have thumbnails generated.");
                }
                return 0;
            }

            Console.WriteLine($"\n📊 Found {mediaItems.Count} media item(s):");
            Console.WriteLine();

            // Table header
            Console.WriteLine("┌────────┬─────────────────────────────────────┬─────────────┬──────────────────────────┐");
            Console.WriteLine("│   ID   │                Title                │  Category   │     Thumbnail Status     │");
            Console.WriteLine("├────────┼─────────────────────────────────────┼─────────────┼──────────────────────────┤");

            foreach (var item in mediaItems)
            {
                var title = item.Title.Length > 35 ? item.Title.Substring(0, 32) + "..." : item.Title;
                var category = item.Category?.Name ?? "Unknown";
                var status = GetThumbnailStatus(item);

                Console.WriteLine($"│ {item.Id,6} │ {title,-35} │ {category,-11} │ {status,-24} │");
            }

            Console.WriteLine("└────────┴─────────────────────────────────────┴─────────────┴──────────────────────────┘");

            // Summary
            var withWebP = mediaItems.Count(m => !string.IsNullOrEmpty(m.ThumbnailWebpUrl) && !string.IsNullOrEmpty(m.LargeWebpUrl));
            var withoutWebP = mediaItems.Count - withWebP;

            Console.WriteLine();
            Console.WriteLine($"📊 Summary:");
            Console.WriteLine($"   ✅ With WebP thumbnails: {withWebP}");
            Console.WriteLine($"   ⏳ Missing WebP thumbnails: {withoutWebP}");

            return 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"💥 Error: {ex.Message}");
            return 1;
        }
    }

    private string GetThumbnailStatus(OldenEraFanSite.Api.Models.MediaItem item)
    {
        var hasJpegThumb = !string.IsNullOrEmpty(item.ThumbnailUrl);
        var hasWebpThumb = !string.IsNullOrEmpty(item.ThumbnailWebpUrl);
        var hasJpegLarge = !string.IsNullOrEmpty(item.LargeUrl);
        var hasWebpLarge = !string.IsNullOrEmpty(item.LargeWebpUrl);

        if (hasJpegThumb && hasWebpThumb && hasJpegLarge && hasWebpLarge)
            return "✅ Complete";
        else if (hasJpegThumb && hasJpegLarge)
            return "⚠️  JPEG only";
        else if (hasWebpThumb || hasWebpLarge)
            return "🔄 Partial WebP";
        else
            return "❌ Missing";
    }

    private ListMediaOptions ParseArguments(string[] args)
    {
        var options = new ListMediaOptions();

        for (int i = 0; i < args.Length; i++)
        {
            switch (args[i].ToLower())
            {
                case "--all":
                case "-a":
                    options.ShowAll = true;
                    break;
                    
                case "--help":
                case "-h":
                    ShowHelp();
                    Environment.Exit(0);
                    break;
            }
        }

        return options;
    }

    private void ShowHelp()
    {
        Console.WriteLine("📋 List Media Command");
        Console.WriteLine();
        Console.WriteLine("Usage: dotnet run -- list-media [options]");
        Console.WriteLine();
        Console.WriteLine("Options:");
        Console.WriteLine("  --all, -a          Show all media items (default: only missing thumbnails)");
        Console.WriteLine("  --help, -h         Show this help message");
        Console.WriteLine();
        Console.WriteLine("Examples:");
        Console.WriteLine("  dotnet run -- list-media");
        Console.WriteLine("  dotnet run -- list-media --all");
    }

    private class ListMediaOptions
    {
        public bool ShowAll { get; set; }
    }
}