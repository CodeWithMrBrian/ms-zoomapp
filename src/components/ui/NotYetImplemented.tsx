import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface NotYetImplementedProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
  comingSoonDate?: string;
}

/**
 * NotYetImplemented Modal
 *
 * Shows a placeholder modal for features that haven't been implemented yet.
 * Used during development/testing to indicate work-in-progress features.
 */
export function NotYetImplemented({
  isOpen,
  onClose,
  featureName,
  description,
  comingSoonDate
}: NotYetImplementedProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feature Not Yet Implemented"
      size="sm"
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Feature Name */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {featureName}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Coming Soon Badge */}
        {comingSoonDate && (
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                Coming Soon:
              </span>
              <span className="text-teal-900 dark:text-teal-100 text-sm font-semibold">
                {comingSoonDate}
              </span>
            </div>
          </div>
        )}

        {/* Development Note */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            This feature is currently under development. Check back later for updates!
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={onClose}
            className="min-w-[120px]"
          >
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  );
}
