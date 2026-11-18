import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`}
    />
  );
};

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface/80 border border-border/60 rounded-xl p-6 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="pt-4 border-t border-border/40 flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface/60 border border-border/60 rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};
