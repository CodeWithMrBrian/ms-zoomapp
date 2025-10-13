import React from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component
 *
 * Shows hierarchical navigation path for nested pages.
 *
 * Usage:
 * ```tsx
 * <Breadcrumbs items={[
 *   { label: 'Home', onClick: () => navigate('home') },
 *   { label: 'Account', onClick: () => navigate('account') },
 *   { label: 'Payment Methods' }
 * ]} />
 * ```
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {isLast ? (
              <span
                className="font-medium text-gray-900 dark:text-gray-100"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
