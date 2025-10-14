import React from 'react';

/**
 * Standard Navigation Header Component
 *
 * Based on Material Design and iOS HIG standards for consistent navigation.
 * Research sources:
 * - Material Design: Back button always top-left
 * - Nielsen Norman Group: Consistency and Standards heuristic
 * - Stack Exchange UX: "Previous/Back is always to the left"
 * - WCAG 2.1 AA: Breadcrumb navigation with ARIA support
 *
 * Usage:
 * <NavigationHeader
 *   title="Screen Title"
 *   onBack={handleBack}
 *   backLabel="Back"
 *   breadcrumbs={[{label: 'Home', onClick: goHome}, {label: 'Settings'}]}
 *   showSettings={true}
 *   onSettings={openSettings}
 *   showHelp={true}
 *   onHelp={openHelp}
 *   actions={<button>Custom Action</button>}
 * />
 */

export interface Breadcrumb {
  /** Label to display for breadcrumb */
  label: string;
  /** Optional click handler (last breadcrumb typically not clickable) */
  onClick?: () => void;
}

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
  /** Optional breadcrumb navigation (WCAG 2.1 AA compliant) */
  breadcrumbs?: Breadcrumb[];
  /** Show built-in Settings icon (defaults to false) */
  showSettings?: boolean;
  /** Settings button handler (required if showSettings is true) */
  onSettings?: () => void;
  /** Show built-in Help icon (defaults to false) */
  showHelp?: boolean;
  /** Help button handler (required if showHelp is true) */
  onHelp?: () => void;
}

export function NavigationHeader({
  title,
  onBack,
  backLabel = 'Back',
  actions,
  showBackButton = true,
  subtitle,
  breadcrumbs,
  showSettings = false,
  onSettings,
  showHelp = false,
  onHelp
}: NavigationHeaderProps) {
  const hasBackButton = showBackButton && onBack;
  const hasBuiltInActions = showSettings || showHelp;
  const hasAnyActions = actions || hasBuiltInActions;

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

          {/* Breadcrumbs - Below title (WCAG 2.1 AA compliant) */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mt-2 text-sm">
              <ol className="flex items-center gap-2 list-none p-0 m-0">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={index} className="flex items-center gap-2">
                      {index > 0 && (
                        <span className="text-teal-200" aria-hidden="true">/</span>
                      )}
                      {crumb.onClick && !isLast ? (
                        <button
                          onClick={crumb.onClick}
                          className="text-white hover:text-teal-100 transition-colors underline"
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span
                          className="text-teal-100"
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
        </div>

        {/* Actions - Right Side */}
        {hasAnyActions && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Built-in Settings Icon */}
            {showSettings && onSettings && (
              <button
                onClick={onSettings}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-medium text-sm"
                aria-label="Settings"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

            {/* Built-in Help Icon */}
            {showHelp && onHelp && (
              <button
                onClick={onHelp}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-medium text-sm"
                aria-label="Help"
                title="Help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}

            {/* Custom Actions */}
            {actions}
          </div>
        )}

        {/* Spacer for centering title when no actions */}
        {hasBackButton && !hasAnyActions && (
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
