using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace OldenEraFanSite.Api.Services;

public interface IImageProcessingService
{
    Task<ProcessedImageResult> ProcessImageAsync(string originalPath);
    Task<ProcessedImageResult> ProcessImageAsync(Stream imageStream, string fileName);
    string GetThumbnailPath(string fileName);
    string GetLargePath(string fileName);
    string GetPublicUrl(string filePath);
}

public class ProcessedImageResult
{
    public string OriginalUrl { get; set; } = "";
    public string ThumbnailUrl { get; set; } = "";
    public string ThumbnailWebpUrl { get; set; } = "";
    public string LargeUrl { get; set; } = "";
    public string LargeWebpUrl { get; set; } = "";
    public int Width { get; set; }
    public int Height { get; set; }
    public long FileSize { get; set; }
}

public class ImageProcessingService : IImageProcessingService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ImageProcessingService> _logger;

    // Configuration
    private const int ThumbnailWidth = 300;
    private const int ThumbnailHeight = 200;
    private const int LargeWidth = 1200;
    private const int LargeHeight = 800;
    private const int WebpQuality = 85;
    private const int JpegQuality = 85;
    private const int LargeWebpQuality = 90;
    private const int LargeJpegQuality = 90;

    public ImageProcessingService(IWebHostEnvironment environment, ILogger<ImageProcessingService> logger)
    {
        _environment = environment;
        _logger = logger;
        
        // Ensure directories exist
        EnsureDirectoriesExist();
    }

    public async Task<ProcessedImageResult> ProcessImageAsync(string originalPath)
    {
        try
        {
            var fileInfo = new FileInfo(originalPath);
            var baseFileName = Path.GetFileNameWithoutExtension(originalPath);
            
            using var image = await Image.LoadAsync(originalPath);
            var originalWidth = image.Width;
            var originalHeight = image.Height;

            var result = new ProcessedImageResult
            {
                OriginalUrl = GetPublicUrl(originalPath),
                Width = originalWidth,
                Height = originalHeight,
                FileSize = fileInfo.Length
            };

            // Generate thumbnails
            await GenerateThumbnailsAsync(image, baseFileName, result);

            // Generate large versions
            await GenerateLargeVersionsAsync(image, baseFileName, result);

            _logger.LogInformation("Successfully processed image: {FileName}", baseFileName);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing image: {OriginalPath}", originalPath);
            throw;
        }
    }

    public async Task<ProcessedImageResult> ProcessImageAsync(Stream imageStream, string fileName)
    {
        try
        {
            var baseFileName = Path.GetFileNameWithoutExtension(fileName);
            
            using var image = await Image.LoadAsync(imageStream);
            var originalWidth = image.Width;
            var originalHeight = image.Height;

            // Save original file
            var originalPath = Path.Combine(GetOriginalDir(), fileName);
            imageStream.Position = 0; // Reset stream position
            using var fileStream = File.Create(originalPath);
            await imageStream.CopyToAsync(fileStream);

            var result = new ProcessedImageResult
            {
                OriginalUrl = GetPublicUrl(originalPath),
                Width = originalWidth,
                Height = originalHeight,
                FileSize = imageStream.Length
            };

            // Generate thumbnails
            await GenerateThumbnailsAsync(image, baseFileName, result);

            // Generate large versions
            await GenerateLargeVersionsAsync(image, baseFileName, result);

            _logger.LogInformation("Successfully processed image from stream: {FileName}", fileName);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing image from stream: {FileName}", fileName);
            throw;
        }
    }

    private async Task GenerateThumbnailsAsync(Image image, string baseFileName, ProcessedImageResult result)
    {
        // Generate JPEG thumbnail
        var jpegThumbnailPath = Path.Combine(GetThumbnailDir(), $"{baseFileName}_thumb.jpg");
        using var jpegThumbnail = image.Clone(ctx => ctx.Resize(ThumbnailWidth, ThumbnailHeight, KnownResamplers.Lanczos3));
        await jpegThumbnail.SaveAsJpegAsync(jpegThumbnailPath, new JpegEncoder { Quality = JpegQuality });
        result.ThumbnailUrl = GetPublicUrl(jpegThumbnailPath);

        // Generate WebP thumbnail
        var webpThumbnailPath = Path.Combine(GetThumbnailDir(), $"{baseFileName}_thumb.webp");
        using var webpThumbnail = image.Clone(ctx => ctx.Resize(ThumbnailWidth, ThumbnailHeight, KnownResamplers.Lanczos3));
        await webpThumbnail.SaveAsWebpAsync(webpThumbnailPath, new WebpEncoder 
        { 
            Quality = WebpQuality,
            Method = WebpEncodingMethod.BestQuality
        });
        result.ThumbnailWebpUrl = GetPublicUrl(webpThumbnailPath);
    }

    private async Task GenerateLargeVersionsAsync(Image image, string baseFileName, ProcessedImageResult result)
    {
        // Only resize if original is larger than target size
        var shouldResize = image.Width > LargeWidth || image.Height > LargeHeight;
        
        if (shouldResize)
        {
            // Generate JPEG large version
            var jpegLargePath = Path.Combine(GetLargeDir(), $"{baseFileName}_large.jpg");
            using var jpegLarge = image.Clone(ctx => ctx.Resize(LargeWidth, LargeHeight, KnownResamplers.Lanczos3));
            await jpegLarge.SaveAsJpegAsync(jpegLargePath, new JpegEncoder { Quality = LargeJpegQuality });
            result.LargeUrl = GetPublicUrl(jpegLargePath);

            // Generate WebP large version
            var webpLargePath = Path.Combine(GetLargeDir(), $"{baseFileName}_large.webp");
            using var webpLarge = image.Clone(ctx => ctx.Resize(LargeWidth, LargeHeight, KnownResamplers.Lanczos3));
            await webpLarge.SaveAsWebpAsync(webpLargePath, new WebpEncoder 
            { 
                Quality = LargeWebpQuality,
                Method = WebpEncodingMethod.BestQuality
            });
            result.LargeWebpUrl = GetPublicUrl(webpLargePath);
        }
        else
        {
            // Use original for large versions if it's already small enough
            result.LargeUrl = result.OriginalUrl;
            
            // Still create WebP version for better compression
            var webpLargePath = Path.Combine(GetLargeDir(), $"{baseFileName}_large.webp");
            await image.SaveAsWebpAsync(webpLargePath, new WebpEncoder 
            { 
                Quality = LargeWebpQuality,
                Method = WebpEncodingMethod.BestQuality
            });
            result.LargeWebpUrl = GetPublicUrl(webpLargePath);
        }
    }

    public string GetThumbnailPath(string fileName)
    {
        var baseFileName = Path.GetFileNameWithoutExtension(fileName);
        return Path.Combine(GetThumbnailDir(), $"{baseFileName}_thumb.jpg");
    }

    public string GetLargePath(string fileName)
    {
        var baseFileName = Path.GetFileNameWithoutExtension(fileName);
        return Path.Combine(GetLargeDir(), $"{baseFileName}_large.jpg");
    }

    public string GetPublicUrl(string filePath)
    {
        // For temporary thumbnails, return the final frontend URL where they will be served
        if (filePath.Contains("temp") && (filePath.Contains("thumbnails") || filePath.Contains("large")))
        {
            var fileName = Path.GetFileName(filePath);
            
            if (filePath.Contains("thumbnails"))
            {
                return $"/images/screenshots/thumbnails/{fileName}";
            }
            else if (filePath.Contains("large"))
            {
                return $"/images/screenshots/large/{fileName}";
            }
        }
        
        // Fallback to original logic for other files
        var wwwrootPath = Path.Combine(_environment.WebRootPath);
        var relativePath = Path.GetRelativePath(wwwrootPath, filePath);
        
        // Convert Windows paths to URL paths
        var urlPath = relativePath.Replace('\\', '/');
        
        return $"/{urlPath}";
    }

    private string GetOriginalDir()
    {
        return Path.Combine(_environment.WebRootPath, "uploads", "media", "originals");
    }

    private string GetThumbnailDir()
    {
        // Save thumbnails temporarily in backend for batch processing
        return Path.Combine(_environment.WebRootPath, "temp", "thumbnails");
    }

    private string GetLargeDir()
    {
        // Save large versions temporarily in backend for batch processing  
        return Path.Combine(_environment.WebRootPath, "temp", "large");
    }

    private void EnsureDirectoriesExist()
    {
        var directories = new[]
        {
            GetOriginalDir(),
            GetThumbnailDir(),
            GetLargeDir()
        };

        foreach (var dir in directories)
        {
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
                _logger.LogInformation("Created directory: {Directory}", dir);
            }
        }
    }
}