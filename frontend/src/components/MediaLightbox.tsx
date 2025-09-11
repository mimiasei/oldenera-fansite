import React, { useEffect } from 'react';
import { MediaItem } from '../types';
import OptimizedImage from './OptimizedImage';

interface MediaLightboxProps {
  mediaItem: MediaItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  onFullscreen?: () => void;
}

const MediaLightbox: React.FC<MediaLightboxProps> = ({
  mediaItem,
  onClose,
  onNext,
  onPrevious,
  showNavigation = false,
  onFullscreen,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (!showNavigation) return;
      
      if (event.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (event.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
      }
    };

    if (mediaItem) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleArrowKeys);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleArrowKeys);
      document.body.style.overflow = '';
    };
  }, [mediaItem, onClose, onNext, onPrevious, showNavigation]);

  if (!mediaItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Lightbox Content */}
      <div className="relative max-w-7xl max-h-full mx-4 flex flex-col">
        {/* Top-right button group */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {/* Fullscreen Button (only for images) */}
          {mediaItem.mediaType === 'image' && (
            <button
              onClick={onFullscreen}
              className="text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
              title="Fullscreen"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2" />
              </svg>
            </button>
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            title="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Buttons */}
        {showNavigation && onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {showNavigation && onNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Media Content */}
        <div className="relative max-h-[80vh] flex items-center justify-center">
          {mediaItem.mediaType === 'video' ? (
            <video
              src={mediaItem.largeUrl || mediaItem.originalUrl}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <OptimizedImage
              webpSrc={mediaItem.largeWebpUrl}
              jpegSrc={mediaItem.largeUrl}
              fallbackSrc={mediaItem.largeUrl || mediaItem.originalUrl}
              alt={mediaItem.altText || mediaItem.title}
              className="lightbox-main-image max-w-full max-h-full object-contain"
              loading="eager"
            />
          )}
        </div>

        {/* Media Info */}
        <div className="bg-gray-900/90 text-white p-6 max-w-full">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold font-fantasy">{mediaItem.title}</h2>
            <div className="flex items-center text-sm text-gray-400 ml-4">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {mediaItem.viewCount} views
            </div>
          </div>

          {mediaItem.description && (
            <p className="text-gray-300 mb-4">{mediaItem.description}</p>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            {mediaItem.category && (
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: mediaItem.category.color }}
              >
                {mediaItem.category.name}
              </span>
            )}

            {mediaItem.faction && (
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                {mediaItem.faction.name}
              </span>
            )}

            {mediaItem.isFeatured && (
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Featured
              </span>
            )}

            {mediaItem.width && mediaItem.height && (
              <span className="text-gray-400 text-sm">
                {mediaItem.width} × {mediaItem.height}
              </span>
            )}
          </div>

          {mediaItem.caption && (
            <p className="text-gray-400 text-sm mt-4 italic">{mediaItem.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaLightbox;