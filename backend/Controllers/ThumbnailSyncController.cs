using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThumbnailSyncController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ThumbnailSyncController> _logger;

    public ThumbnailSyncController(
        IWebHostEnvironment environment,
        ILogger<ThumbnailSyncController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpGet("download-pending")]
    public async Task<IActionResult> DownloadPendingThumbnails()
    {
        try
        {
            var tempThumbnailsDir = Path.Combine(_environment.WebRootPath, "temp", "thumbnails");
            var tempLargeDir = Path.Combine(_environment.WebRootPath, "temp", "large");

            // Check if there are any pending thumbnails
            var hasPendingFiles = (Directory.Exists(tempThumbnailsDir) && Directory.GetFiles(tempThumbnailsDir).Any()) ||
                                 (Directory.Exists(tempLargeDir) && Directory.GetFiles(tempLargeDir).Any());

            if (!hasPendingFiles)
            {
                return NotFound(new { message = "No pending thumbnails found" });
            }

            // Create a temporary zip file
            var zipFileName = $"thumbnails_{DateTimeOffset.UtcNow:yyyyMMdd_HHmmss}.zip";
            var tempZipPath = Path.Combine(Path.GetTempPath(), zipFileName);

            using (var zipArchive = ZipFile.Open(tempZipPath, ZipArchiveMode.Create))
            {
                // Add thumbnail files
                if (Directory.Exists(tempThumbnailsDir))
                {
                    foreach (var file in Directory.GetFiles(tempThumbnailsDir))
                    {
                        var fileName = Path.GetFileName(file);
                        zipArchive.CreateEntryFromFile(file, $"thumbnails/{fileName}");
                    }
                }

                // Add large image files
                if (Directory.Exists(tempLargeDir))
                {
                    foreach (var file in Directory.GetFiles(tempLargeDir))
                    {
                        var fileName = Path.GetFileName(file);
                        zipArchive.CreateEntryFromFile(file, $"large/{fileName}");
                    }
                }
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(tempZipPath);
            
            // Clean up temp zip file
            System.IO.File.Delete(tempZipPath);

            var fileCount = (Directory.Exists(tempThumbnailsDir) ? Directory.GetFiles(tempThumbnailsDir).Length : 0) +
                           (Directory.Exists(tempLargeDir) ? Directory.GetFiles(tempLargeDir).Length : 0);

            _logger.LogInformation("📦 Created thumbnail zip with {FileCount} files for download", fileCount);

            return File(fileBytes, "application/zip", zipFileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to create thumbnail download zip");
            return StatusCode(500, new { message = "Failed to create thumbnail archive" });
        }
    }

    [HttpPost("mark-synced")]
    public async Task<IActionResult> MarkThumbnailsSynced()
    {
        try
        {
            var tempThumbnailsDir = Path.Combine(_environment.WebRootPath, "temp", "thumbnails");
            var tempLargeDir = Path.Combine(_environment.WebRootPath, "temp", "large");

            var deletedCount = 0;

            // Clean up synced thumbnails
            if (Directory.Exists(tempThumbnailsDir))
            {
                var files = Directory.GetFiles(tempThumbnailsDir);
                deletedCount += files.Length;
                foreach (var file in files)
                {
                    System.IO.File.Delete(file);
                }
            }

            // Clean up synced large images
            if (Directory.Exists(tempLargeDir))
            {
                var files = Directory.GetFiles(tempLargeDir);
                deletedCount += files.Length;
                foreach (var file in files)
                {
                    System.IO.File.Delete(file);
                }
            }

            _logger.LogInformation("🧹 Cleaned up {Count} synced thumbnail files", deletedCount);

            return Ok(new { 
                message = $"Cleaned up {deletedCount} synced thumbnail files",
                deletedCount 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to clean up synced thumbnails");
            return StatusCode(500, new { message = "Failed to clean up synced thumbnails" });
        }
    }

    [HttpGet("status")]
    public IActionResult GetSyncStatus()
    {
        try
        {
            var tempThumbnailsDir = Path.Combine(_environment.WebRootPath, "temp", "thumbnails");
            var tempLargeDir = Path.Combine(_environment.WebRootPath, "temp", "large");

            var thumbnailCount = Directory.Exists(tempThumbnailsDir) ? Directory.GetFiles(tempThumbnailsDir).Length : 0;
            var largeCount = Directory.Exists(tempLargeDir) ? Directory.GetFiles(tempLargeDir).Length : 0;
            var totalPending = thumbnailCount + largeCount;

            return Ok(new {
                pendingThumbnails = thumbnailCount,
                pendingLarge = largeCount,
                totalPending,
                hasUnsyncedFiles = totalPending > 0,
                lastChecked = DateTimeOffset.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to get sync status");
            return StatusCode(500, new { message = "Failed to get sync status" });
        }
    }
}