import React from 'react';

/**
 * Standard Navigation Header Component
 *
 * Based on Material Design and iOS HIG standards for consistent navigation.
 * Research sources:
 * - Material Design: Back button always top-left
 * - Nielsen Norman Group: Consistency and Standards heuristic
 * - Stack Exchange UX: "Previous/Back is always to the left"
 *
 * Usage:
 * <NavigationHeader
 *   title="Screen Title"
 *   onBack={handleBack}
 *   backLabel="Back"
 *   actions={<button>Settings</button>}
 * />
 */

export interface NavigationHeaderProps {
  /** Screen title displayed in header */
  title: string;
  /** Optional back button handler */
  onBack?: () => void;
  /** Optional label for back button (defaults to "Back") */
  backLabel?: string;
  /** Optional actions to display on right side */
  actions?: React.ReactNode;
  /** Show/hide back button (defaults to true if onBack provided) */
  showBackButton?: boolean;
  /** Optional subtitle or description */
  subtitle?: string;
}

export function NavigationHeader({
  title,
  onBack,
  backLabel = 'Back',
  actions,
  showBackButton = true,
  subtitle
}: NavigationHeaderProps) {
  const hasBackButton = showBackButton && onBack;

  return (
    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-lg px-4 sm:px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        {/* Back Button - Left Side (Material Design Standard) */}
        {hasBackButton && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors font-medium min-w-0 shrink-0"
            aria-label={backLabel}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
        )}

        {/* Title - Center or Left if no back button */}
        <div className={`min-w-0 ${hasBackButton ? 'flex-1 text-center' : ''}`}>
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-teal-100 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions - Right Side */}
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {actions}
          </div>
        )}

        {/* Spacer for centering title when no actions */}
        {hasBackButton && !actions && (
          <div className="w-5 h-5 shrink-0" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

/**
 * Action Button for Navigation Header
 * Consistent styling for header action buttons
 */
interface NavigationActionProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  className?: string;
}

export function NavigationAction({ onClick, icon, label, className = '' }: NavigationActionProps) {
  const hasLabel = label && label.trim() !== '';
  return (
    <button
      onClick={onClick}
      className={`flex items-center ${hasLabel ? 'gap-2' : 'gap-0'} px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-medium text-sm ${className}`}
      aria-label={label || 'Settings'}
    >
      {icon}
      {hasLabel && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
