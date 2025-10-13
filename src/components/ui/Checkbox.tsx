import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

/**
 * Checkbox component with dark mode support
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-4 h-4 text-teal-600
              bg-white dark:bg-gray-700
              border-gray-300 dark:border-gray-600
              rounded
              focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              transition-colors duration-150
              ${className}
            `.trim()}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-gray-600 dark:text-gray-400">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
