import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'selected' | 'beautiful';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Card component following V3 Design System specifications
 *
 * Features:
 * - White background
 * - Rounded corners (rounded-lg)
 * - Subtle shadow (shadow-sm)
 * - Configurable padding
 *
 * Variants:
 * - default: Standard card
 * - hover: Card with hover shadow effect
 * - selected: Card with teal highlight border
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick
}) => {
  // Base styles with dark mode
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg';

  // Variant styles with improved dark mode visibility
  const variantStyles = {
    default: 'shadow-sm border border-gray-200 dark:border-gray-600 dark:shadow-lg dark:shadow-black/10',
    hover: 'shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 ease-out cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-500 hover:-translate-y-1 transform hover:shadow-teal-500/10 dark:hover:shadow-teal-500/20',
    selected: 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 dark:border-teal-400 shadow-md ring-1 ring-teal-100 dark:ring-teal-800 border border-teal-200 dark:border-teal-700',
    beautiful: 'shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 border border-gray-200 dark:border-gray-600 relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 transform before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-teal-600 before:to-cyan-600 cursor-pointer hover:shadow-teal-500/10 dark:hover:shadow-teal-500/20'
  };

  // Padding styles
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim();

  return (
    <div className={combinedClassName} onClick={onClick}>
      {children}
    </div>
  );
};

Card.displayName = 'Card';

/**
 * CardHeader component for card titles and descriptions
 */
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`mb-6 ${className}`.trim()}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component for card headings
 */
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight ${className}`.trim()}>
    {children}
  </h3>
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component for card subtitles
 */
export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1.5 ${className}`.trim()}>
    {children}
  </p>
);

CardDescription.displayName = 'CardDescription';

/**
 * CardContent component for card body content
 */
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`text-gray-900 dark:text-gray-100 ${className}`.trim()}>
    {children}
  </div>
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter component for card actions
 */
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`mt-4 ${className}`.trim()}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';
