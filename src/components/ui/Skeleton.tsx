import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton - Loading placeholder component
 *
 * Provides elegant loading states with shimmer animation
 * Variants: text (single line), circular (avatar), rectangular (custom)
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'wave'
}) => {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';

  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * SkeletonText - Multiple lines of skeleton text
 */
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

/**
 * SkeletonCard - Full card skeleton
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 ${className}`}>
    <div className="flex items-start space-x-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-3">
        <Skeleton width="40%" height={20} />
        <SkeletonText lines={2} />
      </div>
    </div>
  </div>
);

export default Skeleton;
