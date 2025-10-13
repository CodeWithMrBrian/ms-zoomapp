import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  inputSize?: 'sm' | 'md' | 'lg';
}

/**
 * Input component following V3 Design System specifications
 *
 * Features:
 * - Border gray-300, rounded-lg
 * - Focus ring with teal-500 (3px)
 * - Error state with red border
 * - Disabled state with gray-50 background
 * - Optional label, error message, and helper text
 * - Size variants: sm, md, lg
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, errorMessage, label, helperText, inputSize = 'md', className = '', disabled, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    // Base styles - enhanced focus ring with dark mode
    const baseStyles = 'w-full border rounded-lg transition-all duration-150 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-3 focus:ring-offset-1';

    // Conditional styles with improved dark mode visibility
    const stateStyles = error
      ? 'border-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-400 focus:ring-red-200 dark:focus:ring-red-900/50'
      : 'border-gray-300 dark:border-gray-500 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-200 dark:focus:ring-teal-900/50 hover:border-gray-400 dark:hover:border-gray-400';

    const disabledStyles = disabled
      ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60 text-gray-500 dark:text-gray-400'
      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';

    const combinedClassName = `${baseStyles} ${sizeStyles[inputSize]} ${stateStyles} ${disabledStyles} ${className}`.trim();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClassName}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={
            (error && errorMessage) || helperText
              ? `${inputId}-description`
              : undefined
          }
          {...props}
        />
        {helperText && !error && (
          <p
            id={`${inputId}-description`}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
        {error && errorMessage && (
          <p
            id={`${inputId}-description`}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
