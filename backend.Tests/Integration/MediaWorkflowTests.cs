using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using OldenEraFanSite.Api.Models;
using Xunit;

namespace OldenEraFanSite.Api.Tests.Integration;

public class MediaWorkflowTests : TestBase
{
    private readonly JsonSerializerOptions _jsonOptions;

    public MediaWorkflowTests()
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    [Fact]
    public async Task CompleteMediaUploadWorkflow_Success()
    {
        // Arrange - Authenticate as moderator
        var moderatorToken = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(moderatorToken);

        // Step 1: Get available categories for upload form
        var categoriesResponse = await Client.GetAsync("/api/media/categories");
        categoriesResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var categories = await categoriesResponse.Content.ReadFromJsonAsync<List<MediaCategory>>(_jsonOptions);
        categories.Should().NotBeNull().And.NotBeEmpty();

        // Step 2: Create new media item
        var newMediaItem = new MediaItem
        {
            Title = "Integration Test Media",
            Description = "This is a test media item created during integration testing",
            MediaType = "image",
            OriginalUrl = "/uploads/test-integration.jpg",
            ThumbnailUrl = "/uploads/thumbs/test-integration-thumb.jpg",
            CategoryId = categories!.First().Id,
            Width = 1920,
            Height = 1080,
            Tags = "integration,test,workflow",
            AltText = "Integration test image",
            IsApproved = false, // Starts as unapproved
            IsFeatured = false
        };

        var createResponse = await Client.PostAsJsonAsync("/api/media", newMediaItem, _jsonOptions);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createdItem = await createResponse.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
        createdItem.Should().NotBeNull();
        createdItem!.UploadedByUserId.Should().Be("moderator-user-id");
        var mediaId = createdItem.Id;

        // Step 3: Verify item appears in unapproved list
        var unapprovedResponse = await Client.GetAsync("/api/media?approvedOnly=false");
        var allItems = await unapprovedResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        allItems.Should().Contain(i => i.Id == mediaId && !i.IsApproved);

        // Step 4: Admin approves the item
        var adminToken = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(adminToken);

        createdItem.IsApproved = true;
        createdItem.IsFeatured = true; // Also feature it
        var updateResponse = await Client.PutAsJsonAsync($"/api/media/{mediaId}", createdItem, _jsonOptions);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Step 5: Verify item now appears in public approved list
        Client.DefaultRequestHeaders.Authorization = null; // Remove auth header
        var publicResponse = await Client.GetAsync("/api/media");
        var publicItems = await publicResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        publicItems.Should().Contain(i => i.Id == mediaId && i.IsApproved && i.IsFeatured);

        // Step 6: Verify featured items endpoint includes the item
        var featuredResponse = await Client.GetAsync("/api/media?featuredOnly=true");
        var featuredItems = await featuredResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        featuredItems.Should().Contain(i => i.Id == mediaId);

        // Step 7: View the item (should increment view count)
        var viewResponse = await Client.GetAsync($"/api/media/{mediaId}");
        viewResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var viewedItem = await viewResponse.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
        viewedItem!.ViewCount.Should().Be(1); // Incremented from 0

        // Step 8: View again (should increment further)
        await Client.GetAsync($"/api/media/{mediaId}");
        var secondViewResponse = await Client.GetAsync($"/api/media/{mediaId}");
        var secondViewedItem = await secondViewResponse.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
        secondViewedItem!.ViewCount.Should().Be(3); // Incremented twice more
    }

    [Fact]
    public async Task MediaModerationWorkflow_Success()
    {
        // Arrange - Create media items with different approval states
        var adminToken = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(adminToken);

        // Create multiple media items for moderation
        var mediaItems = new[]
        {
            new MediaItem
            {
                Title = "Pending Approval 1",
                MediaType = "image",
                OriginalUrl = "/test/pending1.jpg",
                CategoryId = 1,
                IsApproved = false
            },
            new MediaItem
            {
                Title = "Pending Approval 2", 
                MediaType = "image",
                OriginalUrl = "/test/pending2.jpg",
                CategoryId = 1,
                IsApproved = false
            },
            new MediaItem
            {
                Title = "Auto Approved",
                MediaType = "image", 
                OriginalUrl = "/test/approved.jpg",
                CategoryId = 1,
                IsApproved = true
            }
        };

        var createdIds = new List<int>();
        foreach (var item in mediaItems)
        {
            var response = await Client.PostAsJsonAsync("/api/media", item, _jsonOptions);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var created = await response.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
            createdIds.Add(created!.Id);
        }

        // Step 1: Get all items for moderation (including unapproved)
        var allItemsResponse = await Client.GetAsync("/api/media?approvedOnly=false");
        var allItems = await allItemsResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        allItems.Should().Contain(i => !i.IsApproved); // Should have pending items

        // Step 2: Get only pending items
        var pendingItems = allItems!.Where(i => !i.IsApproved).ToList();
        pendingItems.Should().HaveCountGreaterThanOrEqualTo(2);

        // Step 3: Approve first pending item
        var firstPending = pendingItems.First();
        firstPending.IsApproved = true;
        var approveResponse = await Client.PutAsJsonAsync($"/api/media/{firstPending.Id}", firstPending, _jsonOptions);
        approveResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Step 4: Verify approved item now appears in public list
        Client.DefaultRequestHeaders.Authorization = null;
        var publicResponse = await Client.GetAsync("/api/media");
        var publicItems = await publicResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        publicItems.Should().Contain(i => i.Id == firstPending.Id);

        // Step 5: Verify remaining item is still pending
        SetAuthorizationHeader(adminToken);
        var remainingPendingResponse = await Client.GetAsync("/api/media?approvedOnly=false");
        var remainingItems = await remainingPendingResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        remainingItems.Should().Contain(i => i.Id != firstPending.Id && !i.IsApproved);
    }

    [Fact]
    public async Task MediaCategoryManagementWorkflow_Success()
    {
        // Arrange - Admin creates and manages categories
        var adminToken = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(adminToken);

        // Step 1: Create new category
        var newCategory = new MediaCategory
        {
            Name = "Video Content",
            Description = "Video trailers and gameplay footage",
            Slug = "video-content",
            Color = "#FF6B35",
            IsActive = true,
            SortOrder = 100
        };

        var createResponse = await Client.PostAsJsonAsync("/api/media/categories", newCategory, _jsonOptions);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdCategory = await createResponse.Content.ReadFromJsonAsync<MediaCategory>(_jsonOptions);
        var categoryId = createdCategory!.Id;

        // Step 2: Add media items to the new category
        var videoItem = new MediaItem
        {
            Title = "Gameplay Trailer",
            Description = "Official gameplay trailer",
            MediaType = "video", 
            OriginalUrl = "/videos/gameplay-trailer.mp4",
            ThumbnailUrl = "/videos/thumbs/gameplay-trailer-thumb.jpg",
            CategoryId = categoryId,
            Width = 1920,
            Height = 1080,
            IsApproved = true
        };

        var mediaResponse = await Client.PostAsJsonAsync("/api/media", videoItem, _jsonOptions);
        mediaResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        // Step 3: Verify category appears in public list with media count
        Client.DefaultRequestHeaders.Authorization = null;
        var categoriesResponse = await Client.GetAsync("/api/media/categories");
        var categories = await categoriesResponse.Content.ReadFromJsonAsync<List<MediaCategory>>(_jsonOptions);
        categories.Should().Contain(c => c.Id == categoryId);

        // Step 4: Get media items by category
        var categoryItemsResponse = await Client.GetAsync($"/api/media?categoryId={categoryId}");
        var categoryItems = await categoryItemsResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        categoryItems.Should().HaveCount(1);
        categoryItems!.First().CategoryId.Should().Be(categoryId);
        categoryItems.First().MediaType.Should().Be("video");

        // Step 5: Update category details
        SetAuthorizationHeader(adminToken);
        createdCategory.Name = "Videos & Trailers";
        createdCategory.Description = "Updated description for video content";
        var updateResponse = await Client.PutAsJsonAsync($"/api/media/categories/{categoryId}", createdCategory, _jsonOptions);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Step 6: Verify category update
        var updatedResponse = await Client.GetAsync($"/api/media/categories/{categoryId}");
        var updatedCategory = await updatedResponse.Content.ReadFromJsonAsync<MediaCategory>(_jsonOptions);
        updatedCategory!.Name.Should().Be("Videos & Trailers");
    }

    [Fact]
    public async Task MediaFilteringAndSearchWorkflow_Success()
    {
        // Arrange - Create diverse media items for testing filters
        var adminToken = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(adminToken);

        // Create media items with different properties
        var testItems = new[]
        {
            new MediaItem
            {
                Title = "Dragon Battle Screenshot",
                Description = "Epic dragon battle scene",
                MediaType = "image",
                OriginalUrl = "/test/dragon-battle.jpg",
                CategoryId = 1, // Screenshots
                FactionId = 1, // Haven
                Tags = "dragon,battle,epic,screenshot",
                IsApproved = true,
                IsFeatured = true
            },
            new MediaItem
            {
                Title = "Castle Concept Art",
                Description = "Early concept art of Haven castle",
                MediaType = "image",
                OriginalUrl = "/test/castle-concept.jpg", 
                CategoryId = 2, // Concept Art
                FactionId = 1, // Haven
                Tags = "castle,concept,haven,architecture",
                IsApproved = true,
                IsFeatured = false
            },
            new MediaItem
            {
                Title = "Necromancer Portrait",
                Description = "Character portrait of necromancer",
                MediaType = "image",
                OriginalUrl = "/test/necromancer.jpg",
                CategoryId = 2, // Concept Art
                Tags = "necromancer,portrait,character",
                IsApproved = true,
                IsFeatured = false
            }
        };

        foreach (var item in testItems)
        {
            var response = await Client.PostAsJsonAsync("/api/media", item, _jsonOptions);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        // Remove auth for public testing
        Client.DefaultRequestHeaders.Authorization = null;

        // Step 1: Test search functionality
        var searchResponse = await Client.GetAsync("/api/media?search=dragon");
        var searchResults = await searchResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        searchResults.Should().HaveCount(1);
        searchResults!.First().Title.Should().Contain("Dragon");

        // Step 2: Test category filtering
        var conceptArtResponse = await Client.GetAsync("/api/media?categoryId=2");
        var conceptArtItems = await conceptArtResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        conceptArtItems.Should().HaveCountGreaterThanOrEqualTo(2);
        conceptArtItems!.Should().OnlyContain(i => i.CategoryId == 2);

        // Step 3: Test faction filtering
        var havenResponse = await Client.GetAsync("/api/media?factionId=1");
        var havenItems = await havenResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        havenItems.Should().HaveCountGreaterThanOrEqualTo(2);
        havenItems!.Should().OnlyContain(i => i.FactionId == 1);

        // Step 4: Test featured filtering
        var featuredResponse = await Client.GetAsync("/api/media?featuredOnly=true");
        var featuredItems = await featuredResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        featuredItems.Should().OnlyContain(i => i.IsFeatured);

        // Step 5: Test combined filters
        var combinedResponse = await Client.GetAsync("/api/media?categoryId=2&factionId=1");
        var combinedResults = await combinedResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        combinedResults.Should().OnlyContain(i => i.CategoryId == 2 && i.FactionId == 1);

        // Step 6: Test media type filtering
        var imageResponse = await Client.GetAsync("/api/media?mediaType=image");
        var imageItems = await imageResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        imageItems.Should().OnlyContain(i => i.MediaType == "image");

        // Step 7: Test filters endpoint
        var filtersResponse = await Client.GetAsync("/api/media/filters");
        filtersResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var filtersJson = await filtersResponse.Content.ReadAsStringAsync();
        var filters = JsonSerializer.Deserialize<JsonElement>(filtersJson, _jsonOptions);
        
        filters.GetProperty("categories").GetArrayLength().Should().BeGreaterThan(0);
        filters.GetProperty("mediaTypes").GetArrayLength().Should().BeGreaterThan(0);
        filters.GetProperty("factions").GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task MediaPaginationWorkflow_Success()
    {
        // Arrange - Create many media items to test pagination
        var adminToken = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(adminToken);

        // Create 25 media items
        for (int i = 1; i <= 25; i++)
        {
            var item = new MediaItem
            {
                Title = $"Test Media Item {i:D2}",
                Description = $"Test description for item {i}",
                MediaType = "image",
                OriginalUrl = $"/test/item-{i:D2}.jpg",
                CategoryId = 1,
                IsApproved = true,
                ViewCount = i * 10 // Different view counts for sorting
            };

            var response = await Client.PostAsJsonAsync("/api/media", item, _jsonOptions);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        // Remove auth for public testing
        Client.DefaultRequestHeaders.Authorization = null;

        // Step 1: Test first page
        var page1Response = await Client.GetAsync("/api/media?page=1&pageSize=10");
        page1Response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var page1Items = await page1Response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        page1Items.Should().HaveCount(10);
        
        // Check pagination headers
        page1Response.Headers.GetValues("X-Page").First().Should().Be("1");
        page1Response.Headers.GetValues("X-Page-Size").First().Should().Be("10");
        var totalCount = int.Parse(page1Response.Headers.GetValues("X-Total-Count").First());
        totalCount.Should().BeGreaterThanOrEqualTo(25);
        
        var totalPages = int.Parse(page1Response.Headers.GetValues("X-Total-Pages").First());
        totalPages.Should().BeGreaterThanOrEqualTo(3);

        // Step 2: Test second page
        var page2Response = await Client.GetAsync("/api/media?page=2&pageSize=10");
        var page2Items = await page2Response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        page2Items.Should().HaveCount(10);
        
        page2Response.Headers.GetValues("X-Page").First().Should().Be("2");
        
        // Verify different items on different pages
        var page1Ids = page1Items!.Select(i => i.Id).ToList();
        var page2Ids = page2Items!.Select(i => i.Id).ToList();
        page1Ids.Should().NotIntersectWith(page2Ids);

        // Step 3: Test last page
        var lastPageResponse = await Client.GetAsync($"/api/media?page={totalPages}&pageSize=10");
        var lastPageItems = await lastPageResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        lastPageItems.Should().NotBeEmpty();
        lastPageItems!.Should().HaveCountLessOrEqualTo(10);

        // Step 4: Test page beyond range
        var beyondResponse = await Client.GetAsync($"/api/media?page={totalPages + 1}&pageSize=10");
        var beyondItems = await beyondResponse.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        beyondItems.Should().BeEmpty();
    }
}