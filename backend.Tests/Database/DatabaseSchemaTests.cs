using Microsoft.EntityFrameworkCore;
using OldenEraFanSite.Api.Data;
using OldenEraFanSite.Api.Models;
using Xunit;
using FluentAssertions;

namespace OldenEraFanSite.Api.Tests.Database;

public class DatabaseSchemaTests : TestBase
{
    [Fact]
    public async Task Database_ShouldHave_MediaCategoriesTable()
    {
        // Act & Assert - This will throw if the table doesn't exist
        var canQuery = await Context.MediaCategories.AnyAsync();
        canQuery.Should().BeFalse(); // Should be false for empty test database but shouldn't throw
    }

    [Fact]
    public async Task Database_ShouldHave_MediaItemsTable()
    {
        // Act & Assert - This will throw if the table doesn't exist
        var canQuery = await Context.MediaItems.AnyAsync();
        canQuery.Should().BeFalse(); // Should be false for empty test database but shouldn't throw
    }

    [Fact]
    public async Task MediaItem_ShouldHave_ProperRelationships()
    {
        // Arrange - Create test data
        var category = new MediaCategory
        {
            Id = 1,
            Name = "Test Category",
            Slug = "test-category",
            IsActive = true
        };

        var mediaItem = new MediaItem
        {
            Id = 1,
            Title = "Test Media Item",
            MediaType = "image",
            OriginalUrl = "/test.jpg",
            CategoryId = 1,
            IsApproved = true,
            IsActive = true
        };

        // Act
        Context.MediaCategories.Add(category);
        Context.MediaItems.Add(mediaItem);
        var result = await Context.SaveChangesAsync();

        // Assert
        result.Should().Be(2); // Should save 2 entities

        // Verify relationship works
        var itemWithCategory = await Context.MediaItems
            .Include(m => m.Category)
            .FirstAsync(m => m.Id == 1);

        itemWithCategory.Category.Should().NotBeNull();
        itemWithCategory.Category!.Name.Should().Be("Test Category");
    }

    [Fact]
    public async Task MediaCategory_ShouldHave_MediaItemsCollection()
    {
        // Arrange
        var category = new MediaCategory
        {
            Id = 1,
            Name = "Test Category",
            Slug = "test-category",
            IsActive = true
        };

        var mediaItem1 = new MediaItem
        {
            Id = 1,
            Title = "Test Item 1",
            MediaType = "image",
            OriginalUrl = "/test1.jpg",
            CategoryId = 1,
            IsApproved = true,
            IsActive = true
        };

        var mediaItem2 = new MediaItem
        {
            Id = 2,
            Title = "Test Item 2",
            MediaType = "image",
            OriginalUrl = "/test2.jpg",
            CategoryId = 1,
            IsApproved = true,
            IsActive = true
        };

        // Act
        Context.MediaCategories.Add(category);
        Context.MediaItems.AddRange(mediaItem1, mediaItem2);
        await Context.SaveChangesAsync();

        // Assert
        var categoryWithItems = await Context.MediaCategories
            .Include(c => c.MediaItems)
            .FirstAsync(c => c.Id == 1);

        categoryWithItems.MediaItems.Should().HaveCount(2);
        categoryWithItems.MediaItems.Should().OnlyContain(m => m.CategoryId == 1);
    }
}