import React from 'react';
import { Skeleton, SkeletonImage, SkeletonText, SkeletonAvatar } from '../ui/Skeleton';

export const NewsArticleSkeleton: React.FC = () => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonImage aspectRatio="wide" className="rounded-none" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton height="20px" className="w-16 rounded-full" />
          <Skeleton height="20px" className="w-20 rounded-full" />
        </div>
        <Skeleton height="32px" className="w-4/5 mb-4" />
        <SkeletonText lines={3} className="mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <SkeletonAvatar size="sm" />
            <div className="space-y-1">
              <Skeleton height="14px" className="w-20" />
              <Skeleton height="12px" className="w-16" />
            </div>
          </div>
          <Skeleton height="20px" className="w-24" />
        </div>
      </div>
    </article>
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonImage aspectRatio="video" className="rounded-none" />
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <Skeleton height="16px" className="w-12 rounded-full" />
          <Skeleton height="16px" className="w-16 rounded-full" />
        </div>
        <Skeleton height="24px" className="w-full mb-3" />
        <SkeletonText lines={2} className="mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonAvatar size="sm" />
            <Skeleton height="14px" className="w-16" />
          </div>
          <Skeleton height="16px" className="w-20" />
        </div>
      </div>
    </div>
  );
};

export const NewsListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
};