import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * Select dropdown component with dark mode support
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2 text-base
            bg-white dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            rounded-lg
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            transition-colors duration-150
            ${error ? 'border-red-500' : ''}
            ${className}
          `.trim()}
          style={{
            colorScheme: 'light dark' // This ensures native dropdowns adapt to dark mode
          }}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
