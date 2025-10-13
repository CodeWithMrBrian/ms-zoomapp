import React from 'react';

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * iOS-style toggle switch with dark mode support
 */
export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className="flex items-start justify-between">
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${
            enabled
              ? 'bg-teal-600 dark:bg-teal-500'
              : 'bg-gray-300 dark:bg-gray-600'
          }
        `.trim()}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
            transition-transform duration-200 ease-in-out
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `.trim()}
        />
      </button>
    </div>
  );
};

Toggle.displayName = 'Toggle';
