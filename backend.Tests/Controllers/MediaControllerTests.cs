using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using OldenEraFanSite.Api.Models;
using Xunit;

namespace OldenEraFanSite.Api.Tests.Controllers;

public class MediaControllerTests : TestBase
{
    private readonly JsonSerializerOptions _jsonOptions;

    public MediaControllerTests()
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    [Fact]
    public async Task GetMediaCategories_ReturnsAllActiveCategories()
    {
        // Act
        var response = await Client.GetAsync("/api/media/categories");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var categories = await response.Content.ReadFromJsonAsync<List<MediaCategory>>(_jsonOptions);
        categories.Should().NotBeNull();
        categories!.Should().HaveCount(2);
        categories.Should().OnlyContain(c => c.IsActive);
        categories.Should().Contain(c => c.Name == "Screenshots");
        categories.Should().Contain(c => c.Name == "Concept Art");
    }

    [Fact]
    public async Task GetMediaCategories_WithActiveOnlyFalse_ReturnsAllCategories()
    {
        // Arrange - Add an inactive category
        var inactiveCategory = new MediaCategory
        {
            Id = 3,
            Name = "Inactive Category",
            Slug = "inactive",
            IsActive = false,
            SortOrder = 3
        };
        Context.MediaCategories.Add(inactiveCategory);
        await Context.SaveChangesAsync();

        // Act
        var response = await Client.GetAsync("/api/media/categories?activeOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var categories = await response.Content.ReadFromJsonAsync<List<MediaCategory>>(_jsonOptions);
        categories.Should().NotBeNull();
        categories!.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetMediaItems_ReturnsAllApprovedActiveItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(1); // Only the approved item
        items.First().Title.Should().Be("Test Screenshot 1");
        items.First().IsApproved.Should().BeTrue();

        // Check pagination headers
        response.Headers.Should().ContainKey("X-Total-Count");
        response.Headers.GetValues("X-Total-Count").First().Should().Be("1");
    }

    [Fact]
    public async Task GetMediaItems_WithApprovedOnlyFalse_ReturnsAllItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media?approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(2); // Both approved and unapproved items
    }

    [Fact]
    public async Task GetMediaItems_WithCategoryFilter_ReturnsFilteredItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media?categoryId=1&approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(1);
        items.First().CategoryId.Should().Be(1);
        items.First().Title.Should().Be("Test Screenshot 1");
    }

    [Fact]
    public async Task GetMediaItems_WithMediaTypeFilter_ReturnsFilteredItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media?mediaType=image&approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(2);
        items.Should().OnlyContain(i => i.MediaType == "image");
    }

    [Fact]
    public async Task GetMediaItems_WithFactionFilter_ReturnsFilteredItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media?factionId=1&approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(1);
        items.First().FactionId.Should().Be(1);
    }

    [Fact]
    public async Task GetMediaItems_WithFeaturedOnlyFilter_ReturnsOnlyFeaturedItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media?featuredOnly=true&approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(1);
        items.First().IsFeatured.Should().BeTrue();
        items.First().Title.Should().Be("Test Screenshot 1");
    }

    [Fact]
    public async Task GetMediaItems_WithSearchQuery_ReturnsMatchingItems()
    {
        // Act
        var response = await Client.GetAsync("/api/media?search=screenshot&approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(1);
        items.First().Title.Should().Contain("Screenshot");
    }

    [Fact]
    public async Task GetMediaItems_WithPagination_ReturnsCorrectPage()
    {
        // Act
        var response = await Client.GetAsync("/api/media?page=1&pageSize=1&approvedOnly=false");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var items = await response.Content.ReadFromJsonAsync<List<MediaItem>>(_jsonOptions);
        items.Should().NotBeNull();
        items!.Should().HaveCount(1);

        // Check pagination headers
        response.Headers.GetValues("X-Total-Count").First().Should().Be("2");
        response.Headers.GetValues("X-Page").First().Should().Be("1");
        response.Headers.GetValues("X-Page-Size").First().Should().Be("1");
        response.Headers.GetValues("X-Total-Pages").First().Should().Be("2");
    }

    [Fact]
    public async Task GetMediaItem_WithValidId_ReturnsMediaItem()
    {
        // Act
        var response = await Client.GetAsync("/api/media/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var item = await response.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
        item.Should().NotBeNull();
        item!.Id.Should().Be(1);
        item.Title.Should().Be("Test Screenshot 1");
        item.ViewCount.Should().Be(101); // Should be incremented
    }

    [Fact]
    public async Task GetMediaItem_WithInvalidId_ReturnsNotFound()
    {
        // Act
        var response = await Client.GetAsync("/api/media/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetMediaFilters_ReturnsAvailableFilters()
    {
        // Act
        var response = await Client.GetAsync("/api/media/filters");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var filters = JsonSerializer.Deserialize<JsonElement>(content, _jsonOptions);
        
        filters.GetProperty("categories").GetArrayLength().Should().Be(2);
        filters.GetProperty("mediaTypes").GetArrayLength().Should().Be(1);
        filters.GetProperty("mediaTypes")[0].GetString().Should().Be("image");
        filters.GetProperty("factions").GetArrayLength().Should().Be(1);
    }

    [Fact]
    public async Task CreateMediaItem_WithoutAuth_ReturnsUnauthorized()
    {
        // Arrange
        var newItem = new MediaItem
        {
            Title = "New Test Item",
            Description = "Test description",
            MediaType = "image",
            OriginalUrl = "/test/new.jpg",
            CategoryId = 1
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/media", newItem, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateMediaItem_WithModeratorAuth_CreatesItem()
    {
        // Arrange
        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        var newItem = new MediaItem
        {
            Title = "New Test Item",
            Description = "Test description",
            MediaType = "image",
            OriginalUrl = "/test/new.jpg",
            CategoryId = 1
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/media", newItem, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createdItem = await response.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
        createdItem.Should().NotBeNull();
        createdItem!.Title.Should().Be("New Test Item");
        createdItem.UploadedByUserId.Should().Be("moderator-user-id");
    }

    [Fact]
    public async Task CreateMediaItem_WithRegularUser_ReturnsForbidden()
    {
        // Arrange
        var token = GenerateJwtToken("regular-user-id", "user@test.com", "User");
        SetAuthorizationHeader(token);

        var newItem = new MediaItem
        {
            Title = "New Test Item",
            Description = "Test description",
            MediaType = "image",
            OriginalUrl = "/test/new.jpg",
            CategoryId = 1
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/media", newItem, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task UpdateMediaItem_WithModeratorAuth_UpdatesItem()
    {
        // Arrange
        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        var updateItem = new MediaItem
        {
            Id = 1,
            Title = "Updated Test Item",
            Description = "Updated description",
            MediaType = "image",
            OriginalUrl = "/test/updated.jpg",
            CategoryId = 1,
            IsApproved = true,
            IsFeatured = false,
            IsActive = true
        };

        // Act
        var response = await Client.PutAsJsonAsync("/api/media/1", updateItem, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the update
        var getResponse = await Client.GetAsync("/api/media/1");
        var updatedItem = await getResponse.Content.ReadFromJsonAsync<MediaItem>(_jsonOptions);
        updatedItem!.Title.Should().Be("Updated Test Item");
    }

    [Fact]
    public async Task UpdateMediaItem_WithMismatchedId_ReturnsBadRequest()
    {
        // Arrange
        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        var updateItem = new MediaItem
        {
            Id = 2, // Different from URL
            Title = "Updated Test Item",
            MediaType = "image",
            OriginalUrl = "/test/updated.jpg",
            CategoryId = 1
        };

        // Act
        var response = await Client.PutAsJsonAsync("/api/media/1", updateItem, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task DeleteMediaItem_WithAdminAuth_DeletesItem()
    {
        // Arrange
        var token = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(token);

        // Act
        var response = await Client.DeleteAsync("/api/media/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion
        var getResponse = await Client.GetAsync("/api/media/1");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteMediaItem_WithModeratorAuth_ReturnsForbidden()
    {
        // Arrange
        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        // Act
        var response = await Client.DeleteAsync("/api/media/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task CreateMediaCategory_WithAdminAuth_CreatesCategory()
    {
        // Arrange
        var token = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(token);

        var newCategory = new MediaCategory
        {
            Name = "Test Category",
            Description = "Test description",
            Slug = "test-category",
            Color = "#FF0000",
            IsActive = true,
            SortOrder = 10
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/media/categories", newCategory, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createdCategory = await response.Content.ReadFromJsonAsync<MediaCategory>(_jsonOptions);
        createdCategory.Should().NotBeNull();
        createdCategory!.Name.Should().Be("Test Category");
        createdCategory.Slug.Should().Be("test-category");
    }

    [Fact]
    public async Task CreateMediaCategory_WithModeratorAuth_ReturnsForbidden()
    {
        // Arrange
        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        var newCategory = new MediaCategory
        {
            Name = "Test Category",
            Description = "Test description", 
            Slug = "test-category",
            Color = "#FF0000"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/media/categories", newCategory, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task GetMediaCategory_WithValidId_ReturnsCategory()
    {
        // Act
        var response = await Client.GetAsync("/api/media/categories/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var category = await response.Content.ReadFromJsonAsync<MediaCategory>(_jsonOptions);
        category.Should().NotBeNull();
        category!.Id.Should().Be(1);
        category.Name.Should().Be("Screenshots");
    }

    [Fact]
    public async Task GetMediaCategory_WithInvalidId_ReturnsNotFound()
    {
        // Act
        var response = await Client.GetAsync("/api/media/categories/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateMediaCategory_WithAdminAuth_UpdatesCategory()
    {
        // Arrange
        var token = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(token);

        var updateCategory = new MediaCategory
        {
            Id = 1,
            Name = "Updated Screenshots",
            Description = "Updated description",
            Slug = "updated-screenshots",
            Color = "#FF0000",
            IsActive = true,
            SortOrder = 1
        };

        // Act
        var response = await Client.PutAsJsonAsync("/api/media/categories/1", updateCategory, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the update
        var getResponse = await Client.GetAsync("/api/media/categories/1");
        var updatedCategory = await getResponse.Content.ReadFromJsonAsync<MediaCategory>(_jsonOptions);
        updatedCategory!.Name.Should().Be("Updated Screenshots");
    }

    [Fact]
    public async Task DeleteMediaCategory_WithMediaItems_ReturnsBadRequest()
    {
        // Arrange
        var token = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(token);

        // Act - Try to delete category 1 which has media items
        var response = await Client.DeleteAsync("/api/media/categories/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Cannot delete category that contains media items");
    }

    [Fact]
    public async Task DeleteMediaCategory_WithoutMediaItems_DeletesCategory()
    {
        // Arrange
        var token = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(token);

        // Create a category without media items
        var emptyCategory = new MediaCategory
        {
            Id = 10,
            Name = "Empty Category",
            Slug = "empty-category",
            IsActive = true
        };
        Context.MediaCategories.Add(emptyCategory);
        await Context.SaveChangesAsync();

        // Act
        var response = await Client.DeleteAsync("/api/media/categories/10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion
        var getResponse = await Client.GetAsync("/api/media/categories/10");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}