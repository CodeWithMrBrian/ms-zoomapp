import React from 'react';

export interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number; // 1-indexed (step 1, step 2, etc.)
  className?: string;
}

/**
 * ProgressIndicator Component
 *
 * Shows progress through a multi-step flow (e.g., checkout, onboarding).
 *
 * Usage:
 * ```tsx
 * <ProgressIndicator
 *   steps={['Select Package', 'Payment', 'Confirmation']}
 *   currentStep={2}
 * />
 * ```
 */
export function ProgressIndicator({ steps, currentStep, className = '' }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li
              key={index}
              className="flex items-center flex-1"
            >
              <div className="flex flex-col items-center flex-1">
                {/* Circle indicator */}
                <div className="flex items-center justify-center relative">
                  {isCompleted ? (
                    <div className="w-10 h-10 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isCurrent ? (
                    <div className="w-10 h-10 rounded-full border-2 border-teal-600 dark:border-teal-500 bg-white dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        {stepNumber}
                      </span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-500">
                        {stepNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <span className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-teal-600 dark:text-teal-400'
                      : isCompleted
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              </div>

              {/* Connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-30px]">
                  <div className={`h-full ${
                    isCompleted ? 'bg-teal-600 dark:bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
