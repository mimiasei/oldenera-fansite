# Disqus Forum Integration Setup

## Overview
This project uses Disqus for community features including:
- Comments on news articles
- Main forum discussion page
- User engagement and moderation

## Disqus Account Setup

### 1. Create Disqus Site
1. Go to [Disqus Admin](https://disqus.com/admin/)
2. Click "Add Disqus to Site"
3. Fill out site details:
   - **Site Name**: Heroes of Might and Magic: Olden Era Fan Site
   - **Category**: Gaming
   - **Website URL**: Your production domain
   - **Shortname**: `oldenerafansite` (used in code)

### 2. Configure Site Settings
1. **General Settings**:
   - Site URL: Production domain
   - Description: Community forum for Heroes of Might and Magic: Olden Era fans
   - Language: English
   
2. **Moderation Settings**:
   - Pre-moderation: Recommended for new communities
   - Comment policy: Set appropriate community guidelines
   - Spam filtering: Enable automatic spam detection
   
3. **Community Settings**:
   - Guest commenting: Configure based on preference
   - Social login: Enable for better user experience
   - Comment sorting: Recommend "Best" or "Oldest"

## Implementation Details

### Frontend Integration
- **Component**: `src/components/DisqusComments.tsx`
- **Pages**: News articles (`/news/:id`) and Forum page (`/forum`)
- **Configuration**: Shortname set to `oldenerafansite`

### Disqus Identifiers
- **News Articles**: `news-article-{id}` (e.g., `news-article-1`)
- **Main Forum**: `olden-era-forum-main`
- **URLs**: Full canonical URLs for proper tracking

### Current Configuration
```typescript
// In DisqusComments component
const DISQUS_SHORTNAME = 'oldenerafansite';

// News article example
<DisqusComments
  url={`${window.location.origin}/news/${article.id}`}
  identifier={`news-article-${article.id}`}
  title={article.title}
/>

// Forum page example
<DisqusComments
  url={`${window.location.origin}/forum`}
  identifier="olden-era-forum-main"
  title="Heroes of Might and Magic: Olden Era Community Forum"
/>
```

## Production Deployment

### Environment Variables
No environment variables needed - Disqus is configured directly in the component.

### Domain Configuration
1. Update Disqus site settings with production domain
2. Add trusted domains in Disqus admin panel
3. Test comments on staging before production release

### Moderation Setup
1. **Moderators**: Add site administrators as Disqus moderators
2. **Guidelines**: Configure community guidelines in Disqus admin
3. **Notifications**: Set up email notifications for new comments
4. **Automation**: Configure automatic moderation rules

## Features Included

### News Article Comments
- Unique identifier per article
- Proper URL canonicalization
- Article title as discussion title
- Integrated below article content

### Main Forum Page
- Central community discussion
- Forum guidelines prominently displayed
- Popular topics overview
- Professional forum interface

### User Experience
- Responsive design matching site theme
- Loading states and error handling
- JavaScript fallback message
- Mobile-optimized interface

## Customization Options

### Disqus Universal Code Customization
```javascript
// Available in DisqusComments component
window.disqus_config = function () {
  this.page.url = url;           // Canonical URL
  this.page.identifier = identifier; // Unique identifier
  this.page.title = title;       // Discussion title
  
  // Additional options:
  // this.page.category_id = 'category_id';
  // this.page.remote_auth_s3 = 'remote_auth_s3';
  // this.callbacks.onNewComment = [function() { ... }];
};
```

### Styling
- Disqus inherits site fonts and colors
- Custom CSS can be added via Disqus admin panel
- Mobile responsiveness handled automatically

## Testing Checklist

### Development Testing
- [ ] News article comments load properly
- [ ] Forum page displays correctly
- [ ] JavaScript disabled shows fallback message
- [ ] Mobile responsiveness verified
- [ ] Unique identifiers working correctly

### Production Testing
- [ ] Domain configuration verified in Disqus
- [ ] Comments persist across page reloads
- [ ] Social login working (if enabled)
- [ ] Moderation tools accessible
- [ ] Email notifications functioning
- [ ] Performance impact acceptable

## Maintenance

### Regular Tasks
1. **Monitor Comments**: Check for spam and inappropriate content
2. **Update Guidelines**: Keep community rules current
3. **Review Analytics**: Use Disqus analytics for engagement insights
4. **Backup Discussions**: Export comments regularly for backup

### Troubleshooting
- **Comments not loading**: Check shortname and domain configuration
- **Wrong discussions**: Verify URL and identifier consistency
- **Styling issues**: Review Disqus admin customization settings
- **Performance problems**: Consider lazy loading implementation

## Support Resources
- [Disqus Installation Guide](https://help.disqus.com/en/articles/1717112-universal-embed-code)
- [Disqus Moderation Guide](https://help.disqus.com/en/articles/1717116-moderation-tools)
- [Disqus API Documentation](https://disqus.com/api/docs/)