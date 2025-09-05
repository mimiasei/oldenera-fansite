using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using OldenEraFanSite.Api.Models;
using Xunit;

namespace OldenEraFanSite.Api.Tests.Controllers;

public class NewsControllerTests : TestBase
{
    private readonly JsonSerializerOptions _jsonOptions;

    public NewsControllerTests()
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    [Fact]
    public async Task GetNews_ReturnsPublishedArticles()
    {
        // Arrange - Add test news articles
        var publishedArticle = new NewsArticle
        {
            Id = 1,
            Title = "Published Article",
            Content = "This is published content",
            Summary = "Published summary",
            Author = "Test Author",
            IsPublished = true,
            Tags = new List<string> { "test", "published" }
        };

        var unpublishedArticle = new NewsArticle
        {
            Id = 2,
            Title = "Unpublished Article", 
            Content = "This is unpublished content",
            Summary = "Unpublished summary",
            Author = "Test Author",
            IsPublished = false,
            Tags = new List<string> { "test", "draft" }
        };

        Context.NewsArticles.AddRange(publishedArticle, unpublishedArticle);
        await Context.SaveChangesAsync();

        // Act
        var response = await Client.GetAsync("/api/news");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var articles = await response.Content.ReadFromJsonAsync<List<NewsArticle>>(_jsonOptions);
        articles.Should().NotBeNull();
        articles!.Should().HaveCount(1);
        articles.First().IsPublished.Should().BeTrue();
        articles.First().Title.Should().Be("Published Article");
    }

    [Fact]
    public async Task GetNewsById_WithValidId_ReturnsArticle()
    {
        // Arrange
        var article = new NewsArticle
        {
            Id = 10,
            Title = "Test Article",
            Content = "Test content",
            Summary = "Test summary", 
            Author = "Test Author",
            IsPublished = true,
            Tags = new List<string> { "test" }
        };

        Context.NewsArticles.Add(article);
        await Context.SaveChangesAsync();

        // Act
        var response = await Client.GetAsync("/api/news/10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var returnedArticle = await response.Content.ReadFromJsonAsync<NewsArticle>(_jsonOptions);
        returnedArticle.Should().NotBeNull();
        returnedArticle!.Id.Should().Be(10);
        returnedArticle.Title.Should().Be("Test Article");
    }

    [Fact]
    public async Task GetNewsById_WithInvalidId_ReturnsNotFound()
    {
        // Act
        var response = await Client.GetAsync("/api/news/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateNews_WithoutAuth_ReturnsUnauthorized()
    {
        // Arrange
        var newArticle = new NewsArticle
        {
            Title = "New Article",
            Content = "New content",
            Summary = "New summary",
            Author = "Test Author"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/news", newArticle, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateNews_WithModeratorAuth_CreatesArticle()
    {
        // Arrange
        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        var newArticle = new NewsArticle
        {
            Title = "Moderator Article",
            Content = "Content created by moderator",
            Summary = "Moderator summary",
            Author = "Moderator User",
            IsPublished = true,
            Tags = new List<string> { "moderator", "test" }
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/news", newArticle, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createdArticle = await response.Content.ReadFromJsonAsync<NewsArticle>(_jsonOptions);
        createdArticle.Should().NotBeNull();
        createdArticle!.Title.Should().Be("Moderator Article");
        createdArticle.Author.Should().Be("Moderator User");
    }

    [Fact]
    public async Task UpdateNews_WithModeratorAuth_UpdatesArticle()
    {
        // Arrange
        var existingArticle = new NewsArticle
        {
            Id = 20,
            Title = "Original Title",
            Content = "Original content",
            Summary = "Original summary",
            Author = "Original Author",
            IsPublished = true,
            Tags = new List<string> { "original" }
        };

        Context.NewsArticles.Add(existingArticle);
        await Context.SaveChangesAsync();

        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        var updateArticle = new NewsArticle
        {
            Id = 20,
            Title = "Updated Title",
            Content = "Updated content",
            Summary = "Updated summary",
            Author = "Updated Author",
            IsPublished = true,
            Tags = new List<string> { "updated", "test" }
        };

        // Act
        var response = await Client.PutAsJsonAsync("/api/news/20", updateArticle, _jsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the update
        var getResponse = await Client.GetAsync("/api/news/20");
        var updatedArticle = await getResponse.Content.ReadFromJsonAsync<NewsArticle>(_jsonOptions);
        updatedArticle!.Title.Should().Be("Updated Title");
        updatedArticle.Content.Should().Be("Updated content");
    }

    [Fact]
    public async Task DeleteNews_WithAdminAuth_DeletesArticle()
    {
        // Arrange
        var articleToDelete = new NewsArticle
        {
            Id = 30,
            Title = "Article to Delete",
            Content = "Content to be deleted",
            Summary = "Summary to be deleted",
            Author = "Test Author",
            IsPublished = true,
            Tags = new List<string> { "delete", "test" }
        };

        Context.NewsArticles.Add(articleToDelete);
        await Context.SaveChangesAsync();

        var token = GenerateJwtToken("admin-user-id", "admin@test.com", "Admin");
        SetAuthorizationHeader(token);

        // Act
        var response = await Client.DeleteAsync("/api/news/30");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion
        var getResponse = await Client.GetAsync("/api/news/30");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteNews_WithModeratorAuth_ReturnsForbidden()
    {
        // Arrange
        var articleToDelete = new NewsArticle
        {
            Id = 31,
            Title = "Protected Article",
            Content = "Protected content",
            Summary = "Protected summary",
            Author = "Test Author",
            IsPublished = true,
            Tags = new List<string> { "protected" }
        };

        Context.NewsArticles.Add(articleToDelete);
        await Context.SaveChangesAsync();

        var token = GenerateJwtToken("moderator-user-id", "moderator@test.com", "Moderator");
        SetAuthorizationHeader(token);

        // Act
        var response = await Client.DeleteAsync("/api/news/31");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task GetNews_WithSearchFilter_ReturnsMatchingArticles()
    {
        // Arrange
        var articles = new[]
        {
            new NewsArticle
            {
                Id = 40,
                Title = "Dragon Battle Update",
                Content = "Epic dragon battles are coming",
                Summary = "Dragons and battles",
                Author = "Game Dev",
                IsPublished = true,
                Tags = new List<string> { "dragon", "battle", "update" }
            },
            new NewsArticle
            {
                Id = 41,
                Title = "Castle Construction Guide",
                Content = "How to build the perfect castle",
                Summary = "Castle building tips",
                Author = "Strategy Expert",
                IsPublished = true,
                Tags = new List<string> { "castle", "building", "guide" }
            }
        };

        Context.NewsArticles.AddRange(articles);
        await Context.SaveChangesAsync();

        // Act
        var response = await Client.GetAsync("/api/news?search=dragon");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var searchResults = await response.Content.ReadFromJsonAsync<List<NewsArticle>>(_jsonOptions);
        searchResults.Should().NotBeNull();
        searchResults!.Should().HaveCount(1);
        searchResults.First().Title.Should().Contain("Dragon");
    }

    [Fact]
    public async Task GetNews_WithTagFilter_ReturnsMatchingArticles()
    {
        // Arrange - Add articles with specific tags
        var articles = new[]
        {
            new NewsArticle
            {
                Id = 50,
                Title = "Update Article 1",
                Content = "Update content 1",
                Summary = "Update summary 1",
                Author = "Dev Team",
                IsPublished = true,
                Tags = new List<string> { "update", "gameplay" }
            },
            new NewsArticle
            {
                Id = 51,
                Title = "News Article 2",
                Content = "News content 2",
                Summary = "News summary 2",
                Author = "Community Manager",
                IsPublished = true,
                Tags = new List<string> { "news", "community" }
            },
            new NewsArticle
            {
                Id = 52,
                Title = "Update Article 3",
                Content = "Update content 3",
                Summary = "Update summary 3",
                Author = "Dev Team",
                IsPublished = true,
                Tags = new List<string> { "update", "features" }
            }
        };

        Context.NewsArticles.AddRange(articles);
        await Context.SaveChangesAsync();

        // Act
        var response = await Client.GetAsync("/api/news?tag=update");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var tagResults = await response.Content.ReadFromJsonAsync<List<NewsArticle>>(_jsonOptions);
        tagResults.Should().NotBeNull();
        tagResults!.Should().HaveCount(2);
        tagResults.Should().OnlyContain(a => a.Tags.Contains("update"));
    }
}