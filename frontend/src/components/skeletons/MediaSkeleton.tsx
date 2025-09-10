import React from 'react';
import { Skeleton, SkeletonImage, SkeletonText } from '../ui/Skeleton';

export const MediaItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <SkeletonImage aspectRatio="video" className="rounded-none" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton height="18px" className="w-2/3" />
          <Skeleton height="16px" className="w-12 rounded-full" />
        </div>
        <SkeletonText lines={2} className="mb-3" />
        <div className="flex items-center justify-between text-sm">
          <Skeleton height="14px" className="w-20" />
          <div className="flex items-center gap-2">
            <Skeleton height="14px" className="w-16" />
            <Skeleton height="14px" className="w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MediaGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <MediaItemSkeleton key={i} />
      ))}
    </div>
  );
};

export const MediaFiltersSkeleton: React.FC = () => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} height="36px" className="w-20 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} height="32px" className="w-16 rounded-md" />
        ))}
      </div>
    </div>
  );
};