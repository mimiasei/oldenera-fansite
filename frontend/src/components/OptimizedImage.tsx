import React from 'react';

interface OptimizedImageProps {
  webpSrc?: string;
  jpegSrc?: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  width?: number;
  height?: number;
  onClick?: () => void;
}

/**
 * OptimizedImage component that serves WebP with JPEG fallback
 * Uses <picture> element for automatic format selection by browser
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  webpSrc,
  jpegSrc,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  onClick
}) => {
  // If no optimized sources provided, use regular img
  if (!webpSrc && !jpegSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        onClick={onClick}
      />
    );
  }

  return (
    <picture onClick={onClick}>
      {/* WebP source - preferred format */}
      {webpSrc && (
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
        />
      )}
      
      {/* JPEG source - fallback for older browsers */}
      {jpegSrc && (
        <source 
          srcSet={jpegSrc} 
          type="image/jpeg" 
        />
      )}
      
      {/* Final fallback img element */}
      <img
        src={jpegSrc || fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
      />
    </picture>
  );
};

export default OptimizedImage;