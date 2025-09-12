import React, { useState } from 'react';

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
 * Falls back to original image if thumbnails aren't generated yet
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
  const [webpFailed, setWebpFailed] = useState(false);
  const [jpegFailed, setJpegFailed] = useState(false);

  // If no optimized sources provided or both failed, use original image
  if ((!webpSrc && !jpegSrc) || (webpFailed && jpegFailed)) {
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
      {/* WebP source - preferred format, fallback to original if not yet generated */}
      {webpSrc && !webpFailed && (
        <source 
          srcSet={webpSrc} 
          type="image/webp"
          onError={() => {
            console.log(`WebP thumbnail not yet available: ${webpSrc}, using original`);
            setWebpFailed(true);
          }}
        />
      )}
      
      {/* JPEG source - fallback for older browsers or if WebP failed */}
      {jpegSrc && !jpegFailed && (
        <source 
          srcSet={jpegSrc} 
          type="image/jpeg"
          onError={() => {
            console.log(`JPEG thumbnail not yet available: ${jpegSrc}, using original`);
            setJpegFailed(true);
          }}
        />
      )}
      
      {/* Final fallback to original image */}
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