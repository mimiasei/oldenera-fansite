using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using OldenEraFanSite.Api.Services;

namespace OldenEraFanSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThumbnailSyncController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ThumbnailSyncController> _logger;
    private readonly IConfiguration _configuration;

    public ThumbnailSyncController(
        IWebHostEnvironment environment,
        ILogger<ThumbnailSyncController> logger,
        IConfiguration configuration)
    {
        _environment = environment;
        _logger = logger;
        _configuration = configuration;
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

    [HttpPost("trigger-manual")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> TriggerManualSync()
    {
        try
        {
            var tempThumbnailsDir = Path.Combine(_environment.WebRootPath, "temp", "thumbnails");
            var tempLargeDir = Path.Combine(_environment.WebRootPath, "temp", "large");

            // Check if there are pending thumbnails to sync
            var hasPendingThumbnails = (Directory.Exists(tempThumbnailsDir) && Directory.GetFiles(tempThumbnailsDir).Any()) ||
                                      (Directory.Exists(tempLargeDir) && Directory.GetFiles(tempLargeDir).Any());

            if (!hasPendingThumbnails)
            {
                return Ok(new { 
                    message = "No pending thumbnails to sync",
                    triggered = false,
                    pendingCount = 0 
                });
            }

            var thumbnailCount = 0;
            if (Directory.Exists(tempThumbnailsDir))
                thumbnailCount += Directory.GetFiles(tempThumbnailsDir).Length;
            if (Directory.Exists(tempLargeDir))
                thumbnailCount += Directory.GetFiles(tempLargeDir).Length;

            // Trigger GitHub Action sync immediately
            await TriggerGitHubActionSync();
            
            // Notify the background service about the manual trigger
            ThumbnailBatchSyncService.NotifyManualTrigger();

            _logger.LogInformation("🚀 Manual thumbnail sync triggered by admin for {Count} thumbnails", thumbnailCount);

            return Ok(new { 
                message = $"Manual sync triggered successfully for {thumbnailCount} thumbnails",
                triggered = true,
                pendingCount = thumbnailCount,
                nextAutoSync = DateTimeOffset.UtcNow.AddMinutes(60)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to trigger manual sync");
            return StatusCode(500, new { message = "Failed to trigger manual sync" });
        }
    }

    private async Task TriggerGitHubActionSync()
    {
        var gitHubToken = _configuration["GITHUB_TOKEN"] ?? Environment.GetEnvironmentVariable("GITHUB_TOKEN");
        var repoOwner = _configuration["GITHUB_REPO_OWNER"] ?? Environment.GetEnvironmentVariable("GITHUB_REPO_OWNER");
        var repoName = _configuration["GITHUB_REPO_NAME"] ?? Environment.GetEnvironmentVariable("GITHUB_REPO_NAME");

        if (string.IsNullOrEmpty(gitHubToken) || string.IsNullOrEmpty(repoOwner) || string.IsNullOrEmpty(repoName))
        {
            _logger.LogError("🔧 GitHub configuration missing: Token={HasToken}, Owner={RepoOwner}, Name={RepoName}", 
                !string.IsNullOrEmpty(gitHubToken), repoOwner ?? "MISSING", repoName ?? "MISSING");
            throw new InvalidOperationException("GitHub configuration missing for manual sync trigger");
        }

        _logger.LogInformation("🔧 GitHub API call: Owner={RepoOwner}, Name={RepoName}, URL=https://api.github.com/repos/{RepoOwner}/{RepoName}/dispatches", 
            repoOwner, repoName, repoOwner, repoName);

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {gitHubToken}");
        httpClient.DefaultRequestHeaders.Add("User-Agent", "OldenEra-ThumbnailSync");

        var payload = new
        {
            event_type = "sync-thumbnails",
            client_payload = new
            {
                timestamp = DateTimeOffset.UtcNow.ToString("O"),
                source = "manual-admin-trigger"
            }
        };

        var response = await httpClient.PostAsJsonAsync(
            $"https://api.github.com/repos/{repoOwner}/{repoName}/dispatches",
            payload
        );

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("🔧 GitHub API failed: Status={StatusCode}, URL=https://api.github.com/repos/{RepoOwner}/{RepoName}/dispatches, Response={ErrorContent}", 
                response.StatusCode, repoOwner, repoName, errorContent);
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                throw new HttpRequestException($"GitHub repository not found or token lacks permissions. Check: 1) Repository exists: {repoOwner}/{repoName}, 2) Token has 'repo' permissions, 3) Token is valid");
            }
            
            throw new HttpRequestException($"GitHub API request failed: {response.StatusCode} - {errorContent}");
        }

        _logger.LogInformation("🚀 Manual GitHub repository dispatch sent successfully");
    }
}