using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;

namespace OldenEraFanSite.Api.Commands;

public class CleanupThumbnailsCommand : ICommand
{
    private readonly IServiceProvider _serviceProvider;

    public string Name => "cleanup-thumbnails";
    public string Description => "Remove orphaned thumbnail files and clean up storage";

    public CleanupThumbnailsCommand(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<int> ExecuteAsync(string[] args)
    {
        Console.WriteLine("🧹 Starting thumbnail cleanup...");

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var environment = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

            var options = ParseArguments(args);

            // Get all media items from database
            var mediaItems = await context.MediaItems
                .Where(m => m.IsActive)
                .ToListAsync();

            var knownFiles = new HashSet<string>();
            
            // Collect all known thumbnail files from database
            foreach (var item in mediaItems)
            {
                AddFileToKnownSet(item.OriginalUrl, environment, knownFiles);
                AddFileToKnownSet(item.ThumbnailUrl, environment, knownFiles);
                AddFileToKnownSet(item.ThumbnailWebpUrl, environment, knownFiles);
                AddFileToKnownSet(item.LargeUrl, environment, knownFiles);
                AddFileToKnownSet(item.LargeWebpUrl, environment, knownFiles);
            }

            Console.WriteLine($"📊 Found {knownFiles.Count} files referenced in database");

            // Check thumbnail directories
            var thumbnailDir = Path.Combine(environment.WebRootPath, "uploads", "media", "thumbnails");
            var largeDir = Path.Combine(environment.WebRootPath, "uploads", "media", "large");

            var orphanedFiles = new List<string>();

            // Check thumbnail directory
            if (Directory.Exists(thumbnailDir))
            {
                var thumbnailFiles = Directory.GetFiles(thumbnailDir, "*", SearchOption.AllDirectories);
                foreach (var file in thumbnailFiles)
                {
                    if (!knownFiles.Contains(file))
                    {
                        orphanedFiles.Add(file);
                    }
                }
            }

            // Check large directory
            if (Directory.Exists(largeDir))
            {
                var largeFiles = Directory.GetFiles(largeDir, "*", SearchOption.AllDirectories);
                foreach (var file in largeFiles)
                {
                    if (!knownFiles.Contains(file))
                    {
                        orphanedFiles.Add(file);
                    }
                }
            }

            if (!orphanedFiles.Any())
            {
                Console.WriteLine("✅ No orphaned thumbnail files found.");
                return 0;
            }

            Console.WriteLine($"🗑️  Found {orphanedFiles.Count} orphaned files:");
            
            var totalSize = 0L;
            foreach (var file in orphanedFiles)
            {
                var fileInfo = new FileInfo(file);
                var relativePath = Path.GetRelativePath(environment.WebRootPath, file);
                var sizeKB = fileInfo.Length / 1024;
                totalSize += fileInfo.Length;
                
                Console.WriteLine($"   📄 {relativePath} ({sizeKB:N0} KB)");
            }

            Console.WriteLine($"💾 Total size: {totalSize / 1024:N0} KB");

            if (!options.DryRun)
            {
                Console.WriteLine();
                Console.Write("⚠️  Delete these files? (y/N): ");
                var response = Console.ReadLine();
                
                if (response?.ToLower() != "y")
                {
                    Console.WriteLine("❌ Cleanup cancelled.");
                    return 1;
                }

                var deleted = 0;
                var failed = 0;

                foreach (var file in orphanedFiles)
                {
                    try
                    {
                        File.Delete(file);
                        deleted++;
                        Console.Write(".");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"\n❌ Failed to delete {file}: {ex.Message}");
                        failed++;
                    }
                }

                Console.WriteLine();
                Console.WriteLine($"✅ Deleted {deleted} files");
                if (failed > 0)
                {
                    Console.WriteLine($"❌ Failed to delete {failed} files");
                }
            }
            else
            {
                Console.WriteLine("\n🔍 Dry run mode - no files were deleted");
                Console.WriteLine("   Run without --dry-run to actually delete files");
            }

            return 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"💥 Error: {ex.Message}");
            return 1;
        }
    }

    private void AddFileToKnownSet(string? url, IWebHostEnvironment environment, HashSet<string> knownFiles)
    {
        if (string.IsNullOrEmpty(url)) return;
        
        var relativePath = url.TrimStart('/');
        var fullPath = Path.Combine(environment.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));
        knownFiles.Add(fullPath);
    }

    private CleanupThumbnailsOptions ParseArguments(string[] args)
    {
        var options = new CleanupThumbnailsOptions();

        for (int i = 0; i < args.Length; i++)
        {
            switch (args[i].ToLower())
            {
                case "--dry-run":
                case "-d":
                    options.DryRun = true;
                    Console.WriteLine("🔍 Dry run mode enabled");
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
        Console.WriteLine("🧹 Cleanup Thumbnails Command");
        Console.WriteLine();
        Console.WriteLine("Usage: dotnet run -- cleanup-thumbnails [options]");
        Console.WriteLine();
        Console.WriteLine("Options:");
        Console.WriteLine("  --dry-run, -d      Show what would be deleted without actually deleting");
        Console.WriteLine("  --help, -h         Show this help message");
        Console.WriteLine();
        Console.WriteLine("Examples:");
        Console.WriteLine("  dotnet run -- cleanup-thumbnails --dry-run");
        Console.WriteLine("  dotnet run -- cleanup-thumbnails");
    }

    private class CleanupThumbnailsOptions
    {
        public bool DryRun { get; set; }
    }
}