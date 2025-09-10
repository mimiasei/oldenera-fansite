import React from 'react';
import { Skeleton, SkeletonImage, SkeletonText } from '../ui/Skeleton';

export const FactionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <SkeletonImage aspectRatio="video" className="rounded-none" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton height="32px" className="w-2/3" />
          <Skeleton height="24px" className="w-16 rounded-full" />
        </div>
        <SkeletonText lines={3} className="mb-4" />
        <div className="space-y-2 mb-4">
          <Skeleton height="16px" className="w-full" />
          <Skeleton height="16px" className="w-4/5" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex gap-4">
            <div className="text-center">
              <Skeleton height="20px" className="w-8 mx-auto mb-1" />
              <Skeleton height="12px" className="w-12" />
            </div>
            <div className="text-center">
              <Skeleton height="20px" className="w-8 mx-auto mb-1" />
              <Skeleton height="12px" className="w-12" />
            </div>
          </div>
          <Skeleton height="36px" className="w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const FactionGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <FactionCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const UnitCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        <SkeletonImage aspectRatio="square" className="w-24 h-24 rounded-none flex-shrink-0" />
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton height="20px" className="w-2/3" />
            <Skeleton height="16px" className="w-12 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Skeleton height="14px" className="w-full" />
            <Skeleton height="14px" className="w-full" />
            <Skeleton height="14px" className="w-full" />
            <Skeleton height="14px" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        <SkeletonImage aspectRatio="square" className="w-20 h-20 rounded-none flex-shrink-0" />
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton height="18px" className="w-2/3" />
            <Skeleton height="14px" className="w-16 rounded-full" />
          </div>
          <Skeleton height="14px" className="w-full mb-2" />
          <div className="flex gap-4 text-sm">
            <Skeleton height="14px" className="w-8" />
            <Skeleton height="14px" className="w-8" />
            <Skeleton height="14px" className="w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};