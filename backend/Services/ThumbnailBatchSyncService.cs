using Microsoft.Extensions.Options;

namespace OldenEraFanSite.Api.Services;

public class ThumbnailBatchSyncService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ThumbnailBatchSyncService> _logger;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public ThumbnailBatchSyncService(
        IServiceProvider serviceProvider,
        ILogger<ThumbnailBatchSyncService> logger,
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _environment = environment;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🔄 Thumbnail Batch Sync Service started - checking every 60 minutes");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckAndSyncThumbnails();
                
                // Wait 60 minutes before next check
                await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("🛑 Thumbnail Batch Sync Service cancelled");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in Thumbnail Batch Sync Service");
                
                // Wait 5 minutes before retry on error
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }

    private async Task CheckAndSyncThumbnails()
    {
        var tempThumbnailsDir = Path.Combine(_environment.WebRootPath, "temp", "thumbnails");
        var tempLargeDir = Path.Combine(_environment.WebRootPath, "temp", "large");

        // Check if temp directories exist and have files
        var hasPendingThumbnails = (Directory.Exists(tempThumbnailsDir) && Directory.GetFiles(tempThumbnailsDir).Any()) ||
                                  (Directory.Exists(tempLargeDir) && Directory.GetFiles(tempLargeDir).Any());

        if (!hasPendingThumbnails)
        {
            _logger.LogDebug("🔍 No pending thumbnails found in temp storage");
            return;
        }

        var thumbnailCount = 0;
        if (Directory.Exists(tempThumbnailsDir))
            thumbnailCount += Directory.GetFiles(tempThumbnailsDir).Length;
        if (Directory.Exists(tempLargeDir))
            thumbnailCount += Directory.GetFiles(tempLargeDir).Length;

        _logger.LogInformation("📤 Found {Count} pending thumbnails, triggering GitHub Action sync...", thumbnailCount);

        try
        {
            await TriggerGitHubActionSync();
            _logger.LogInformation("✅ GitHub Action sync triggered successfully for {Count} thumbnails", thumbnailCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to trigger GitHub Action sync");
            throw;
        }
    }

    private async Task TriggerGitHubActionSync()
    {
        var gitHubToken = _configuration["GITHUB_TOKEN"] ?? Environment.GetEnvironmentVariable("GITHUB_TOKEN");
        var repoOwner = _configuration["GITHUB_REPO_OWNER"] ?? Environment.GetEnvironmentVariable("GITHUB_REPO_OWNER");
        var repoName = _configuration["GITHUB_REPO_NAME"] ?? Environment.GetEnvironmentVariable("GITHUB_REPO_NAME");

        if (string.IsNullOrEmpty(gitHubToken) || string.IsNullOrEmpty(repoOwner) || string.IsNullOrEmpty(repoName))
        {
            _logger.LogWarning("⚠️ GitHub configuration missing - skipping sync trigger");
            return;
        }

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {gitHubToken}");
        httpClient.DefaultRequestHeaders.Add("User-Agent", "OldenEra-ThumbnailSync");

        var payload = new
        {
            event_type = "sync-thumbnails",
            client_payload = new
            {
                timestamp = DateTimeOffset.UtcNow.ToString("O"),
                source = "thumbnail-batch-sync-service"
            }
        };

        var response = await httpClient.PostAsJsonAsync(
            $"https://api.github.com/repos/{repoOwner}/{repoName}/dispatches",
            payload
        );

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"GitHub API request failed: {response.StatusCode} - {errorContent}");
        }

        _logger.LogInformation("🚀 GitHub repository dispatch sent successfully");
    }
}