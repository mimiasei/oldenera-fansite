using OldenEraFanSite.Api.Models;

namespace OldenEraFanSite.Api.Tests.Fixtures;

public class MediaTestDataBuilder
{
    public static MediaCategoryBuilder MediaCategory(string name) => new(name);
    public static MediaItemBuilder MediaItem(string title) => new(title);
    public static UserBuilder User(string email) => new(email);
    public static FactionBuilder Faction(string name) => new(name);
}

public class MediaCategoryBuilder
{
    private readonly MediaCategory _category;

    public MediaCategoryBuilder(string name)
    {
        _category = new MediaCategory
        {
            Name = name,
            Description = $"Test description for {name}",
            Slug = name.ToLowerInvariant().Replace(" ", "-"),
            Color = "#3B82F6",
            IsActive = true,
            SortOrder = 0
        };
    }

    public MediaCategoryBuilder WithId(int id)
    {
        _category.Id = id;
        return this;
    }

    public MediaCategoryBuilder WithDescription(string description)
    {
        _category.Description = description;
        return this;
    }

    public MediaCategoryBuilder WithSlug(string slug)
    {
        _category.Slug = slug;
        return this;
    }

    public MediaCategoryBuilder WithColor(string color)
    {
        _category.Color = color;
        return this;
    }

    public MediaCategoryBuilder WithSortOrder(int sortOrder)
    {
        _category.SortOrder = sortOrder;
        return this;
    }

    public MediaCategoryBuilder IsInactive()
    {
        _category.IsActive = false;
        return this;
    }

    public MediaCategory Build() => _category;
}

public class MediaItemBuilder
{
    private readonly MediaItem _item;

    public MediaItemBuilder(string title)
    {
        _item = new MediaItem
        {
            Title = title,
            Description = $"Test description for {title}",
            MediaType = "image",
            OriginalUrl = $"/test/{title.ToLowerInvariant().Replace(" ", "-")}.jpg",
            ThumbnailUrl = $"/test/thumbs/{title.ToLowerInvariant().Replace(" ", "-")}-thumb.jpg",
            CategoryId = 1,
            IsApproved = true,
            IsFeatured = false,
            IsActive = true,
            ViewCount = 0,
            Width = 1920,
            Height = 1080,
            FileSize = 1024000, // 1MB
            SortOrder = 0
        };
    }

    public MediaItemBuilder WithId(int id)
    {
        _item.Id = id;
        return this;
    }

    public MediaItemBuilder WithDescription(string description)
    {
        _item.Description = description;
        return this;
    }

    public MediaItemBuilder WithMediaType(string mediaType)
    {
        _item.MediaType = mediaType;
        return this;
    }

    public MediaItemBuilder WithOriginalUrl(string url)
    {
        _item.OriginalUrl = url;
        return this;
    }

    public MediaItemBuilder WithThumbnailUrl(string url)
    {
        _item.ThumbnailUrl = url;
        return this;
    }

    public MediaItemBuilder WithLargeUrl(string url)
    {
        _item.LargeUrl = url;
        return this;
    }

    public MediaItemBuilder WithCategoryId(int categoryId)
    {
        _item.CategoryId = categoryId;
        return this;
    }

    public MediaItemBuilder WithFactionId(int factionId)
    {
        _item.FactionId = factionId;
        return this;
    }

    public MediaItemBuilder WithUploadedByUserId(string userId)
    {
        _item.UploadedByUserId = userId;
        return this;
    }

    public MediaItemBuilder WithDimensions(int width, int height)
    {
        _item.Width = width;
        _item.Height = height;
        return this;
    }

    public MediaItemBuilder WithFileSize(long size)
    {
        _item.FileSize = size;
        return this;
    }

    public MediaItemBuilder WithTags(string tags)
    {
        _item.Tags = tags;
        return this;
    }

    public MediaItemBuilder WithAltText(string altText)
    {
        _item.AltText = altText;
        return this;
    }

    public MediaItemBuilder WithCaption(string caption)
    {
        _item.Caption = caption;
        return this;
    }

    public MediaItemBuilder WithViewCount(int viewCount)
    {
        _item.ViewCount = viewCount;
        return this;
    }

    public MediaItemBuilder WithSortOrder(int sortOrder)
    {
        _item.SortOrder = sortOrder;
        return this;
    }

    public MediaItemBuilder IsUnapproved()
    {
        _item.IsApproved = false;
        return this;
    }

    public MediaItemBuilder IsFeatured()
    {
        _item.IsFeatured = true;
        return this;
    }

    public MediaItemBuilder IsInactive()
    {
        _item.IsActive = false;
        return this;
    }

    public MediaItemBuilder AsVideo()
    {
        _item.MediaType = "video";
        _item.OriginalUrl = _item.OriginalUrl.Replace(".jpg", ".mp4");
        return this;
    }

    public MediaItemBuilder AsGif()
    {
        _item.MediaType = "gif";
        _item.OriginalUrl = _item.OriginalUrl.Replace(".jpg", ".gif");
        return this;
    }

    public MediaItem Build() => _item;
}

public class UserBuilder
{
    private readonly User _user;

    public UserBuilder(string email)
    {
        _user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = email,
            Email = email,
            FirstName = "Test",
            LastName = "User",
            EmailConfirmed = true
        };
    }

    public UserBuilder WithId(string id)
    {
        _user.Id = id;
        return this;
    }

    public UserBuilder WithName(string firstName, string lastName)
    {
        _user.FirstName = firstName;
        _user.LastName = lastName;
        return this;
    }

    public UserBuilder WithProfilePicture(string url)
    {
        _user.ProfilePictureUrl = url;
        return this;
    }

    public UserBuilder IsUnconfirmed()
    {
        _user.EmailConfirmed = false;
        return this;
    }

    public User Build() => _user;
}

public class FactionBuilder
{
    private readonly Faction _faction;

    public FactionBuilder(string name)
    {
        _faction = new Faction
        {
            Name = name,
            Description = $"Test description for {name} faction",
            Summary = $"Test {name} faction",
            Alignment = "Neutral",
            Specialty = $"{name} specialty",
            IsActive = true,
            SortOrder = 0
        };
    }

    public FactionBuilder WithId(int id)
    {
        _faction.Id = id;
        return this;
    }

    public FactionBuilder WithDescription(string description)
    {
        _faction.Description = description;
        return this;
    }

    public FactionBuilder WithAlignment(string alignment)
    {
        _faction.Alignment = alignment;
        return this;
    }

    public FactionBuilder WithSpecialty(string specialty)
    {
        _faction.Specialty = specialty;
        return this;
    }

    public FactionBuilder WithSortOrder(int sortOrder)
    {
        _faction.SortOrder = sortOrder;
        return this;
    }

    public FactionBuilder IsInactive()
    {
        _faction.IsActive = false;
        return this;
    }

    public Faction Build() => _faction;
}

/// <summary>
/// Provides collections of test data for different scenarios
/// </summary>
public static class MediaTestData
{
    public static List<MediaCategory> GetStandardCategories() => new()
    {
        MediaTestDataBuilder.MediaCategory("Screenshots")
            .WithId(1)
            .WithSlug("screenshots")
            .WithColor("#10B981")
            .WithSortOrder(1)
            .Build(),
            
        MediaTestDataBuilder.MediaCategory("Concept Art")
            .WithId(2)
            .WithSlug("concept-art")
            .WithColor("#8B5CF6")
            .WithSortOrder(2)
            .Build(),
            
        MediaTestDataBuilder.MediaCategory("Character Art")
            .WithId(3)
            .WithSlug("character-art") 
            .WithColor("#F59E0B")
            .WithSortOrder(3)
            .Build()
    };

    public static List<MediaItem> GetSampleMediaItems() => new()
    {
        MediaTestDataBuilder.MediaItem("Epic Battle Scene")
            .WithId(1)
            .WithCategoryId(1)
            .WithFactionId(1)
            .WithTags("battle,epic,screenshot,haven")
            .WithViewCount(150)
            .IsFeatured()
            .Build(),
            
        MediaTestDataBuilder.MediaItem("Castle Concept")
            .WithId(2)
            .WithCategoryId(2)
            .WithTags("castle,concept,architecture")
            .WithViewCount(89)
            .Build(),
            
        MediaTestDataBuilder.MediaItem("Hero Portrait")
            .WithId(3)
            .WithCategoryId(3)
            .WithTags("hero,portrait,character")
            .WithViewCount(67)
            .IsUnapproved()
            .Build(),
            
        MediaTestDataBuilder.MediaItem("Gameplay Video")
            .WithId(4)
            .WithCategoryId(1)
            .AsVideo()
            .WithTags("gameplay,video,demo")
            .WithViewCount(234)
            .IsFeatured()
            .Build()
    };

    public static List<User> GetTestUsers() => new()
    {
        MediaTestDataBuilder.User("admin@test.com")
            .WithId("admin-id")
            .WithName("Admin", "User")
            .Build(),
            
        MediaTestDataBuilder.User("moderator@test.com")
            .WithId("moderator-id")
            .WithName("Moderator", "User")
            .Build(),
            
        MediaTestDataBuilder.User("user@test.com")
            .WithId("user-id")
            .WithName("Regular", "User")
            .Build()
    };

    public static List<Faction> GetTestFactions() => new()
    {
        MediaTestDataBuilder.Faction("Haven")
            .WithId(1)
            .WithAlignment("Order")
            .WithSpecialty("Divine magic and heavy cavalry")
            .WithSortOrder(1)
            .Build(),
            
        MediaTestDataBuilder.Faction("Necropolis")
            .WithId(2)
            .WithAlignment("Chaos")
            .WithSpecialty("Necromancy and undead armies")
            .WithSortOrder(2)
            .Build()
    };
}