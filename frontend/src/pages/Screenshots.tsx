import React, { useState } from 'react';
import { useMediaItems, useMediaCategories } from '../hooks/useSWR';
import { MediaFiltersParams } from '../services/api';
import { MediaItem } from '../types';
import MediaLightbox from '../components/MediaLightbox';
import { MediaGridSkeleton, MediaFiltersSkeleton } from '../components/skeletons/MediaSkeleton';
import AdminEditButton from '../components/AdminEditButton';
import OptimizedImage from '../components/OptimizedImage';

const Screenshots: React.FC = () => {
  const [filters, setFilters] = useState<MediaFiltersParams>({
    approvedOnly: true,
    pageSize: 20,
  });
  
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { mediaItems, isLoading, isError, error } = useMediaItems(filters);
  const { categories, isLoading: categoriesLoading } = useMediaCategories();

  const handleCategoryFilter = (categoryId: number | undefined) => {
    setFilters(prev => ({ ...prev, categoryId }));
  };

  const handleMediaTypeFilter = (mediaType: string | undefined) => {
    setFilters(prev => ({ ...prev, mediaType }));
  };

  const openLightbox = (item: MediaItem, index: number) => {
    setSelectedMedia(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setCurrentIndex(0);
  };

  const openFullscreen = () => {
    if (!selectedMedia) return;
    
    const imgElement = document.querySelector('.lightbox-main-image');
    
    if (imgElement && document.fullscreenEnabled) {
        (imgElement as any).requestFullscreen();
    }
  };

  const goToNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedMedia(mediaItems[nextIndex]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedMedia(mediaItems[prevIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold mb-6 font-fantasy">Screenshots & Media</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Explore stunning visuals from Heroes of Might and Magic: Olden Era. Browse screenshots, 
              concept art, character designs, and more from the upcoming game.
            </p>
          </div>
        </div>

        {/* Content with Skeletons */}
        <div className="container mx-auto px-4 py-8">
          <MediaFiltersSkeleton />
          <MediaGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-400 mb-2">Failed to Load Media</h2>
              <p className="text-red-300 mb-4">
                {error?.message || 'Unable to load media gallery. Please ensure the backend server is running.'}
              </p>
              <p className="text-sm text-gray-400">
                Please check your internet connection and try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6 font-fantasy">Screenshots & Media</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Explore stunning visuals from Heroes of Might and Magic: Olden Era. Browse screenshots, 
            concept art, character designs, and more from the upcoming game.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryFilter(undefined)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !filters.categoryId
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Categories
              </button>
              {!categoriesLoading && categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.categoryId === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: filters.categoryId === category.id ? category.color : undefined,
                    borderColor: category.color
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Media Type Filter */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleMediaTypeFilter(undefined)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !filters.mediaType
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => handleMediaTypeFilter('image')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.mediaType === 'image'
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => handleMediaTypeFilter('video')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.mediaType === 'video'
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Videos
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        {mediaItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Media Found</h3>
            <p className="text-gray-500">
              {filters.categoryId || filters.mediaType
                ? 'Try adjusting your filters to see more content.'
                : 'No media items are available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer group relative"
                onClick={() => openLightbox(item, index)}
              >
                {/* Admin Edit Button */}
                <div 
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AdminEditButton to={`/admin/media/${item.id}/edit`} />
                </div>
                
                <div className="aspect-video relative overflow-hidden">
                  {item.thumbnailUrl || item.thumbnailWebpUrl ? (
                    <OptimizedImage
                      webpSrc={item.thumbnailWebpUrl}
                      jpegSrc={item.thumbnailUrl}
                      fallbackSrc={item.thumbnailUrl || item.originalUrl}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Media type indicator */}
                  <div className="absolute top-2 left-2">
                    {item.mediaType === 'video' && (
                      <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Video
                      </div>
                    )}
                    {item.isFeatured && (
                      <div className="bg-primary-600/90 text-white px-2 py-1 rounded text-xs flex items-center mt-1">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Featured
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      {item.category && (
                        <span 
                          className="px-2 py-1 rounded text-white mr-2"
                          style={{ backgroundColor: item.category.color }}
                        >
                          {item.category.name}
                        </span>
                      )}
                      {item.faction && (
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {item.faction.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.viewCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Lightbox */}
      <MediaLightbox
        mediaItem={selectedMedia}
        onClose={closeLightbox}
        onNext={currentIndex < mediaItems.length - 1 ? goToNext : undefined}
        onPrevious={currentIndex > 0 ? goToPrevious : undefined}
        showNavigation={mediaItems.length > 1}
        onFullscreen={openFullscreen}
      />
    </div>
  );
};

export default Screenshots;