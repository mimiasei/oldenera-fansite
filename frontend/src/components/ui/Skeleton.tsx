import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height }) => {
  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`animate-skeleton bg-gray-300 rounded ${className}`}
      style={style}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <Skeleton height="200px" className="w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton height="24px" className="w-3/4" />
        <Skeleton height="16px" className="w-full" />
        <Skeleton height="16px" className="w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton height="20px" className="w-24" />
          <Skeleton height="20px" className="w-20" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height="16px"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
};

export const SkeletonImage: React.FC<{
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}> = ({ className = '', aspectRatio = 'video' }) => {
  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[2/1]',
  };

  return (
    <Skeleton className={`w-full ${aspectClass[aspectRatio]} ${className}`} />
  );
};

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
};

export const SkeletonButton: React.FC<{
  className?: string;
  variant?: 'primary' | 'secondary';
}> = ({ className = '' }) => {
  return (
    <Skeleton
      height="40px"
      className={`w-24 rounded-md ${className}`}
    />
  );
};