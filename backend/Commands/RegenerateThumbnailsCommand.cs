using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Services;

namespace OldenEraFanSite.Api.Commands;

public class RegenerateThumbnailsCommand : ICommand
{
    private readonly IServiceProvider _serviceProvider;

    public string Name => "regenerate-thumbnails";
    public string Description => "Regenerate thumbnails for all media items or specific items";

    public RegenerateThumbnailsCommand(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<int> ExecuteAsync(string[] args)
    {
        Console.WriteLine("🖼️  Starting thumbnail regeneration...");

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var imageService = scope.ServiceProvider.GetRequiredService<IImageProcessingService>();
            var environment = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

            // Parse command arguments
            var options = ParseArguments(args);
            
            var query = context.MediaItems.Where(m => m.MediaType == "image" && m.IsActive);
            
            // Apply filters based on arguments
            if (options.MediaItemId.HasValue)
            {
                query = query.Where(m => m.Id == options.MediaItemId.Value);
            }
            
            if (options.ForceAll)
            {
                Console.WriteLine("🔄 Force mode: Regenerating ALL thumbnails...");
            }
            else
            {
                // Only regenerate missing thumbnails by default
                query = query.Where(m => string.IsNullOrEmpty(m.ThumbnailWebpUrl) || string.IsNullOrEmpty(m.LargeWebpUrl));
            }

            var mediaItems = await query.ToListAsync();

            if (!mediaItems.Any())
            {
                Console.WriteLine("✅ No media items need thumbnail regeneration.");
                return 0;
            }

            Console.WriteLine($"📋 Found {mediaItems.Count} media items to process");

            var processed = 0;
            var failed = 0;

            foreach (var item in mediaItems)
            {
                try
                {
                    Console.Write($"🔄 Processing: {item.Title} (ID: {item.Id})... ");

                    var originalPath = GetFilePathFromUrl(item.OriginalUrl, environment);
                    
                    if (!File.Exists(originalPath))
                    {
                        Console.WriteLine($"❌ Original file not found: {originalPath}");
                        failed++;
                        continue;
                    }

                    // Process the image to generate all thumbnails
                    var result = await imageService.ProcessImageAsync(originalPath);

                    // Update the media item with new URLs
                    item.ThumbnailUrl = result.ThumbnailUrl;
                    item.ThumbnailWebpUrl = result.ThumbnailWebpUrl;
                    item.LargeUrl = result.LargeUrl;
                    item.LargeWebpUrl = result.LargeWebpUrl;
                    item.UpdatedAt = DateTime.UtcNow;

                    // Update dimensions if not set or if force mode
                    if (!item.Width.HasValue || !item.Height.HasValue || options.ForceAll)
                    {
                        item.Width = result.Width;
                        item.Height = result.Height;
                        item.FileSize = result.FileSize;
                    }

                    await context.SaveChangesAsync();
                    
                    Console.WriteLine("✅");
                    processed++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Error: {ex.Message}");
                    failed++;
                }
            }

            Console.WriteLine($"\n📊 Summary:");
            Console.WriteLine($"   ✅ Processed: {processed}");
            Console.WriteLine($"   ❌ Failed: {failed}");
            Console.WriteLine($"   📋 Total: {mediaItems.Count}");

            return failed > 0 ? 1 : 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"💥 Fatal error: {ex.Message}");
            return 1;
        }
    }

    private RegenerateThumbnailsOptions ParseArguments(string[] args)
    {
        var options = new RegenerateThumbnailsOptions();

        for (int i = 0; i < args.Length; i++)
        {
            switch (args[i].ToLower())
            {
                case "--force":
                case "-f":
                    options.ForceAll = true;
                    Console.WriteLine("🔄 Force mode enabled");
                    break;
                    
                case "--id":
                    if (i + 1 < args.Length && int.TryParse(args[i + 1], out var id))
                    {
                        options.MediaItemId = id;
                        Console.WriteLine($"🎯 Targeting specific media item: {id}");
                        i++; // Skip next argument
                    }
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
        Console.WriteLine("🖼️  Regenerate Thumbnails Command");
        Console.WriteLine();
        Console.WriteLine("Usage: dotnet run -- regenerate-thumbnails [options]");
        Console.WriteLine();
        Console.WriteLine("Options:");
        Console.WriteLine("  --force, -f        Regenerate ALL thumbnails (even existing ones)");
        Console.WriteLine("  --id <number>      Process only specific media item by ID");
        Console.WriteLine("  --help, -h         Show this help message");
        Console.WriteLine();
        Console.WriteLine("Examples:");
        Console.WriteLine("  dotnet run -- regenerate-thumbnails");
        Console.WriteLine("  dotnet run -- regenerate-thumbnails --force");
        Console.WriteLine("  dotnet run -- regenerate-thumbnails --id 123");
    }

    private string GetFilePathFromUrl(string url, IWebHostEnvironment environment)
    {
        var relativePath = url.TrimStart('/');
        return Path.Combine(environment.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));
    }

    private class RegenerateThumbnailsOptions
    {
        public bool ForceAll { get; set; }
        public int? MediaItemId { get; set; }
    }
}