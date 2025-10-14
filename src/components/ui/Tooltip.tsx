import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
  delay?: number; // ms before showing
  disabled?: boolean;
}

/**
 * Tooltip component that shows helpful hints on hover or focus
 *
 * @example
 * <Tooltip content="Starts a new translated meeting">
 *   <Button>Start Meeting</Button>
 * </Tooltip>
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  maxWidth = '240px',
  delay = 300,
  disabled = false
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const handleMouseEnter = () => {
    if (disabled) return;
    const t = setTimeout(() => setShow(true), delay);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setShow(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    setShow(true);
  };

  const handleBlur = () => {
    setShow(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45';
    switch (position) {
      case 'top':
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
    }
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}

      {show && !disabled && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-[60]
            px-3 py-2
            text-sm leading-tight
            bg-gray-900 dark:bg-gray-700
            text-white
            rounded-lg
            shadow-lg
            pointer-events-none
            ${getPositionClasses()}
          `}
          style={{ maxWidth }}
        >
          {content}

          {/* Arrow */}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
}

/**
 * HelpIcon component - Question mark icon for tooltips
 *
 * @example
 * <div className="flex items-center gap-2">
 *   <span>Pay-As-You-Go</span>
 *   <HelpIcon tooltip="Buy credits and use anytime. Credits never expire." />
 * </div>
 */
export interface HelpIconProps {
  tooltip: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function HelpIcon({ tooltip, position = 'top', className = '' }: HelpIconProps) {
  return (
    <Tooltip content={tooltip} position={position}>
      <span
        className={`inline-flex items-center justify-center w-5 h-5 cursor-help ${className}`}
        aria-label="Help"
      >
        <svg
          className="w-5 h-5 text-cyan-700 dark:text-cyan-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 16v-1m0-4a1.5 1.5 0 1 1 1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </span>
    </Tooltip>
  );
}
