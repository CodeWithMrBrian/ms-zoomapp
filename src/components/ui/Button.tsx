import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * Button component following V3 Design System specifications
 *
 * Variants:
 * - primary: Teal background, white text (main actions)
 * - secondary: White background with gray border (secondary actions)
 * - tertiary: Text-only button with teal text (subtle actions)
 * - outline: Teal border with teal text (outlined actions)
 * - destructive: Red background, white text (dangerous actions)
 *
 * Sizes:
 * - sm: Small padding (px-3 py-1.5, text-sm)
 * - md: Medium padding (px-4 py-2, text-base)
 * - lg: Large padding (px-6 py-3, text-lg)
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', disabled, isLoading, children, ...props }, ref) => {
    // Base styles for all buttons
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-teal-500 disabled:cursor-not-allowed';

    // Variant styles - enhanced with improved dark mode contrast and visibility
    const variantStyles = {
      primary: disabled
        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        : 'bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 dark:from-teal-500 dark:via-teal-600 dark:to-teal-700 text-white hover:from-teal-700 hover:via-teal-800 hover:to-teal-900 dark:hover:from-teal-600 dark:hover:via-teal-700 dark:hover:to-teal-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 ease-out relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]',
      secondary: disabled
        ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'
        : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 active:bg-gray-100 dark:active:bg-gray-600 shadow-sm hover:shadow-md dark:shadow-lg dark:shadow-black/20',
      tertiary: disabled
        ? 'bg-transparent text-gray-400 dark:text-gray-600'
        : 'bg-transparent text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/30 active:bg-teal-100 dark:active:bg-teal-900/40 border border-transparent hover:border-teal-200 dark:hover:border-teal-700',
      outline: disabled
        ? 'bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600'
        : 'bg-transparent border-2 border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-700 dark:hover:border-teal-300 active:bg-teal-100 dark:active:bg-teal-900/40 shadow-sm dark:shadow-md dark:shadow-teal-500/20',
      destructive: disabled
        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        : 'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 active:bg-red-800 dark:active:bg-red-800 shadow-sm hover:shadow-md dark:shadow-lg dark:shadow-red-500/20'
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2'
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
