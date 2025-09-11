using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Services;

public class ThumbnailGenerationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ThumbnailGenerationService> _logger;
    private readonly TimeSpan _delay = TimeSpan.FromMinutes(1); // Check every minute

    public ThumbnailGenerationService(
        IServiceScopeFactory scopeFactory, 
        ILogger<ThumbnailGenerationService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ThumbnailGenerationService started");

        // Wait a bit on startup to let the application fully initialize
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessMediaItemsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing media items for thumbnails");
            }

            // Wait before next check
            await Task.Delay(_delay, stoppingToken);
        }
    }

    private async Task ProcessMediaItemsAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var imageService = scope.ServiceProvider.GetRequiredService<IImageProcessingService>();
        var environment = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

        // Find media items that need thumbnail generation
        var itemsToProcess = await context.MediaItems
            .Where(m => m.MediaType == "image" && 
                       m.IsActive && 
                       (string.IsNullOrEmpty(m.ThumbnailWebpUrl) || string.IsNullOrEmpty(m.LargeWebpUrl)))
            .Take(5) // Process 5 items at a time to avoid overloading
            .ToListAsync(cancellationToken);

        if (!itemsToProcess.Any())
        {
            // No items to process
            return;
        }

        _logger.LogInformation("Processing {Count} media items for thumbnail generation", itemsToProcess.Count);

        foreach (var item in itemsToProcess)
        {
            if (cancellationToken.IsCancellationRequested)
                break;

            try
            {
                await GenerateThumbnailsForItem(item, context, imageService, environment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate thumbnails for MediaItem {ItemId}: {Title}", 
                    item.Id, item.Title);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task GenerateThumbnailsForItem(
        MediaItem item, 
        ApplicationDbContext context, 
        IImageProcessingService imageService, 
        IWebHostEnvironment environment)
    {
        try
        {
            // Convert public URL back to file path
            var originalPath = GetFilePathFromUrl(item.OriginalUrl, environment);
            
            if (!File.Exists(originalPath))
            {
                _logger.LogWarning("Original file not found for MediaItem {ItemId}: {Path}", 
                    item.Id, originalPath);
                return;
            }

            _logger.LogInformation("Generating thumbnails for MediaItem {ItemId}: {Title}", 
                item.Id, item.Title);

            // Process the image to generate all thumbnails
            var result = await imageService.ProcessImageAsync(originalPath);

            // Update the media item with new URLs
            item.ThumbnailUrl = result.ThumbnailUrl;
            item.ThumbnailWebpUrl = result.ThumbnailWebpUrl;
            item.LargeUrl = result.LargeUrl;
            item.LargeWebpUrl = result.LargeWebpUrl;
            item.UpdatedAt = DateTime.UtcNow;

            // Update dimensions if not set
            if (!item.Width.HasValue || !item.Height.HasValue)
            {
                item.Width = result.Width;
                item.Height = result.Height;
            }

            _logger.LogInformation("Successfully generated thumbnails for MediaItem {ItemId}", item.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing MediaItem {ItemId}", item.Id);
            throw;
        }
    }

    private string GetFilePathFromUrl(string url, IWebHostEnvironment environment)
    {
        // Remove leading slash and convert URL back to file path
        var relativePath = url.TrimStart('/');
        return Path.Combine(environment.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("ThumbnailGenerationService stopped");
        return base.StopAsync(cancellationToken);
    }
}