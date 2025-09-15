import { NewsArticle, Faction, MediaItem } from '../types';

const siteUrl = import.meta.env.VITE_FRONTEND_URL || 'https://oldenera-fansite.netlify.app';

export const generateWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Olden Wiki - Heroes of Might and Magic: Olden Era Fan Site",
  "description": "Your ultimate source for Heroes of Might and Magic: Olden Era news, game information, screenshots, and community discussions.",
  "url": siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteUrl}/news?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Olden Wiki Community",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/logo.png`
    }
  }
});

export const generateNewsArticleStructuredData = (article: NewsArticle) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": article.title,
  "description": article.summary,
  "image": article.imageUrl ? `${siteUrl}${article.imageUrl}` : `${siteUrl}/images/og-default.jpg`,
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt,
  "author": {
    "@type": "Person",
    "name": article.author || "Olden Wiki Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Olden Wiki",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/logo.png`
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${siteUrl}/news/${article.id}`
  },
  "keywords": article.tags?.join(', '),
  "articleSection": "Gaming News",
  "genre": "Gaming",
  "wordCount": article.content?.length || 0
});

export const generateFactionStructuredData = (faction: Faction) => ({
  "@context": "https://schema.org",
  "@type": "Thing",
  "name": faction.name,
  "description": faction.description,
  "image": faction.logoUrl ? `${siteUrl}${faction.logoUrl}` : undefined,
  "url": `${siteUrl}/factions/${faction.id}`,
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Alignment",
      "value": faction.alignment
    },
    {
      "@type": "PropertyValue",
      "name": "Specialty",
      "value": faction.specialty
    }
  ],
  "isPartOf": {
    "@type": "VideoGame",
    "name": "Heroes of Might and Magic: Olden Era",
    "genre": "Strategy",
    "gamePlatform": "PC"
  }
});

export const generateMediaGalleryStructuredData = (mediaItems: MediaItem[]) => ({
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Heroes of Might and Magic: Olden Era Screenshots",
  "description": "Official and fan-created screenshots, concept art, and media from Heroes of Might and Magic: Olden Era",
  "url": `${siteUrl}/screenshots`,
  "image": mediaItems.slice(0, 10).map(item => ({
    "@type": "ImageObject",
    "name": item.title,
    "description": item.description,
    "url": item.originalUrl,
    "thumbnailUrl": item.thumbnailUrl,
    "width": item.width,
    "height": item.height,
    "contentUrl": item.originalUrl
  })),
  "about": {
    "@type": "VideoGame",
    "name": "Heroes of Might and Magic: Olden Era",
    "genre": "Strategy",
    "gamePlatform": "PC"
  }
});

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `${siteUrl}${crumb.url}`
  }))
});

export const generateGameStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Heroes of Might and Magic: Olden Era",
  "description": "The latest installment in the legendary Heroes of Might and Magic series, featuring epic fantasy strategy gameplay with new factions, heroes, and magical elements.",
  "genre": ["Strategy", "Fantasy", "Turn-based"],
  "gamePlatform": "PC",
  "url": `${siteUrl}/game-info`,
  "publisher": {
    "@type": "Organization",
    "name": "Ubisoft"
  },
  "applicationCategory": "Game",
  "operatingSystem": "Windows, Mac, Linux"
});

export const generateOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Olden Wiki",
  "description": "A fan community dedicated to Heroes of Might and Magic: Olden Era",
  "url": siteUrl,
  "logo": `${siteUrl}/images/logo.png`,
  "sameAs": [
    // Add social media links here when available
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Community Support",
    "url": `${siteUrl}/forum`
  }
});