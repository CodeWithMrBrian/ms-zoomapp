import React from 'react';

export interface BadgeProps {
  variant: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Badge component following V3 Design System specifications
 *
 * Status indicator badges with semantic colors:
 * - success: Green (credit transactions, completed states)
 * - error: Red (debit transactions, failed states)
 * - warning: Yellow (attention needed)
 * - info: Blue (informational, pending states)
 * - neutral: Gray (default/neutral states)
 */
export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  className = '',
  size = 'md'
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center rounded-full font-medium';

  // Variant styles (background and text colors) with dark mode
  const variantStyles = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs'
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

/**
 * Status Badge with optional dot indicator
 */
export const StatusBadge: React.FC<BadgeProps & { showDot?: boolean }> = ({
  variant,
  children,
  showDot = false,
  className = '',
  size = 'md'
}) => {
  const dotColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-blue-600',
    neutral: 'bg-gray-500'
  };

  return (
    <Badge variant={variant} size={size} className={className}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`} />
      )}
      {children}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';
