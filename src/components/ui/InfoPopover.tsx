import React, { useState, useRef, useEffect } from 'react';

export interface InfoPopoverProps {
  title: string;
  children: React.ReactNode; // Popover content
  triggerIcon?: React.ReactNode; // Custom icon (default: ℹ️)
  triggerClassName?: string;
  maxWidth?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * InfoPopover - Click to show detailed explanations
 *
 * @example
 * <InfoPopover title="Pay-As-You-Go Details">
 *   <div className="space-y-2">
 *     <p>Buy credits in advance and use anytime.</p>
 *     <ul>
 *       <li>Professional tier = $75/hour</li>
 *       <li>Credits never expire</li>
 *     </ul>
 *   </div>
 * </InfoPopover>
 */
export function InfoPopover({
  title,
  children,
  triggerIcon,
  triggerClassName = '',
  maxWidth = '400px',
  placement = 'bottom'
}: InfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getPlacementClasses = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-center
          w-5 h-5
          text-gray-400 hover:text-gray-600
          dark:text-gray-500 dark:hover:text-gray-300
          transition-colors
          ${triggerClassName}
        `}
        aria-label="More information"
        aria-expanded={isOpen}
      >
        {triggerIcon || (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-labelledby="popover-title"
          className={`
            absolute z-[60]
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg
            shadow-xl
            ${getPlacementClasses()}
          `}
          style={{ maxWidth }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div
              id="popover-title"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              <svg
                className="w-4 h-4 text-teal-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {title}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-h-96 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * InfoIcon - Styled info icon with popover
 * Convenience wrapper for common use case
 *
 * @example
 * <div className="flex items-center gap-2">
 *   <span>Subscription Plan</span>
 *   <InfoIcon title="About Subscriptions">
 *     <p>Monthly billing with unlimited sessions</p>
 *   </InfoIcon>
 * </div>
 */
export interface InfoIconProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function InfoIcon({ title, children, placement = 'bottom', className = '' }: InfoIconProps) {
  return (
    <InfoPopover
      title={title}
      placement={placement}
      triggerClassName={`
        border border-gray-300 dark:border-gray-600
        rounded-full
        hover:border-gray-400 dark:hover:border-gray-500
        ${className}
      `}
    >
      {children}
    </InfoPopover>
  );
}
