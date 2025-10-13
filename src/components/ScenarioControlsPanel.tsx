import React, { useState } from 'react';
import { Badge } from './ui';

export type ScenarioType = 'active' | 'near-limit' | 'limit-reached' | 'payment-processing' | 'just-upgraded' | 'renewal-due';

export interface ScenarioControlsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  currentScenario: ScenarioType;
  onScenarioChange: (scenario: ScenarioType) => void;
  accountType: 'free-trial' | 'payg' | 'subscription';
  currentState?: {
    sessions?: string; // e.g., "2/3"
    time?: string; // e.g., "15/30 min"
    credits?: number;
    usage?: string; // e.g., "960/1200 min"
  };
}

/**
 * Scenario Controls Panel (Left Side)
 *
 * Allows testers to quickly switch between different app states/scenarios
 * during testing. Positioned on the left side, next to the sidebar width selector.
 *
 * Scenarios:
 * - Active: Normal usage, no warnings
 * - Near Limit: 80% used, warnings shown
 * - Limit Reached: 100% used, modals triggered
 * - Payment Processing: Simulating checkout
 * - Just Upgraded: Success state after payment
 * - Renewal Due: Subscription expiring soon
 */
export function ScenarioControlsPanel({
  isOpen,
  onToggle,
  currentScenario,
  onScenarioChange,
  accountType,
  currentState
}: ScenarioControlsPanelProps) {
  // Collapsed state - just a button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-4 bottom-20 z-50 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-lg transition-all flex items-center gap-2 group"
        title="Open Scenario Controls"
      >
        <span className="hidden group-hover:inline transition-all">Scenarios</span>
      </button>
    );
  }

  // Expanded state - full panel
  return (
    <div className="fixed left-4 bottom-20 z-50 w-72 bg-white dark:bg-gray-900 border-2 border-purple-600 dark:border-purple-500 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span>Scenario Controls</span>
        </div>

        <button
          onClick={onToggle}
          className="text-white hover:text-purple-200 transition-colors"
          aria-label="Collapse"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Current Scenario Label */}
        <div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Current Scenario:
          </div>
          <ScenarioBadge scenario={currentScenario} />
        </div>

        {/* Scenario Options */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Switch to:
          </div>

          {/* Active */}
          <ScenarioOption
            scenario="active"
            icon=""
            label="Active (Normal)"
            description="No warnings or limits"
            isSelected={currentScenario === 'active'}
            onClick={() => onScenarioChange('active')}
          />

          {/* Near Limit */}
          <ScenarioOption
            scenario="near-limit"
            icon=""
            label="Near Limit"
            description={getScenarioDescription('near-limit', accountType)}
            isSelected={currentScenario === 'near-limit'}
            onClick={() => onScenarioChange('near-limit')}
          />

          {/* Limit Reached */}
          <ScenarioOption
            scenario="limit-reached"
            icon=""
            label="Limit Reached"
            description={getScenarioDescription('limit-reached', accountType)}
            isSelected={currentScenario === 'limit-reached'}
            onClick={() => onScenarioChange('limit-reached')}
          />

          {/* Payment Processing */}
          <ScenarioOption
            scenario="payment-processing"
            icon=""
            label="Payment Processing"
            description="Stripe checkout active"
            isSelected={currentScenario === 'payment-processing'}
            onClick={() => onScenarioChange('payment-processing')}
          />

          {/* Just Upgraded */}
          <ScenarioOption
            scenario="just-upgraded"
            icon=""
            label="Just Upgraded"
            description="Success confirmation shown"
            isSelected={currentScenario === 'just-upgraded'}
            onClick={() => onScenarioChange('just-upgraded')}
          />

          {/* Renewal Due (Subscription only) */}
          {accountType === 'subscription' && (
            <ScenarioOption
              scenario="renewal-due"
              icon=""
              label="Renewal Due Soon"
              description="3 days until renewal"
              isSelected={currentScenario === 'renewal-due'}
              onClick={() => onScenarioChange('renewal-due')}
            />
          )}
        </div>

        {/* Current State Display */}
        {currentState && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Current State:
            </div>
            <div className="space-y-1.5 text-xs">
              {currentState.sessions && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentState.sessions}
                  </span>
                </div>
              )}
              {currentState.time && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentState.time}
                  </span>
                </div>
              )}
              {currentState.credits !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentState.credits}
                  </span>
                </div>
              )}
              {currentState.usage && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentState.usage}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300">
          <strong>💡 Tip:</strong> Scenario changes apply instantly. Use the Simulation Controls panel (bottom-right) for fine-grained state manipulation.
        </div>
      </div>
    </div>
  );
}

/**
 * ScenarioBadge - Shows current scenario with icon and color
 */
function ScenarioBadge({ scenario }: { scenario: ScenarioType }) {
  const config = getScenarioConfig(scenario);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgClass} ${config.borderClass} border`}>
      {config.icon && <span className="text-lg">{config.icon}</span>}
      <span className={`text-sm font-medium ${config.textClass}`}>
        {config.label}
      </span>
    </div>
  );
}

/**
 * ScenarioOption - Radio button option for selecting scenario
 */
interface ScenarioOptionProps {
  scenario: ScenarioType;
  icon: string;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function ScenarioOption({
  icon,
  label,
  description,
  isSelected,
  onClick
}: ScenarioOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg border-2 transition-all
        ${
          isSelected
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }
      `}
    >
      <div className="flex items-start gap-2">
        {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">
            {label}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {description}
          </div>
        </div>
        {isSelected && (
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

/**
 * Helper: Get scenario configuration (icon, label, colors)
 */
function getScenarioConfig(scenario: ScenarioType) {
  const configs = {
    'active': {
      icon: '',
      label: 'Active (Normal)',
      bgClass: 'bg-green-50 dark:bg-green-900/20',
      borderClass: 'border-green-200 dark:border-green-700',
      textClass: 'text-green-900 dark:text-green-100'
    },
    'near-limit': {
      icon: '',
      label: 'Near Limit',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderClass: 'border-yellow-200 dark:border-yellow-700',
      textClass: 'text-yellow-900 dark:text-yellow-100'
    },
    'limit-reached': {
      icon: '',
      label: 'Limit Reached',
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      borderClass: 'border-red-200 dark:border-red-700',
      textClass: 'text-red-900 dark:text-red-100'
    },
    'payment-processing': {
      icon: '',
      label: 'Payment Processing',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      borderClass: 'border-blue-200 dark:border-blue-700',
      textClass: 'text-blue-900 dark:text-blue-100'
    },
    'just-upgraded': {
      icon: '',
      label: 'Just Upgraded',
      bgClass: 'bg-teal-50 dark:bg-teal-900/20',
      borderClass: 'border-teal-200 dark:border-teal-700',
      textClass: 'text-teal-900 dark:text-teal-100'
    },
    'renewal-due': {
      icon: '',
      label: 'Renewal Due Soon',
      bgClass: 'bg-orange-50 dark:bg-orange-900/20',
      borderClass: 'border-orange-200 dark:border-orange-700',
      textClass: 'text-orange-900 dark:text-orange-100'
    }
  };

  return configs[scenario];
}

/**
 * Helper: Get scenario-specific description based on account type
 */
function getScenarioDescription(scenario: 'near-limit' | 'limit-reached', accountType: 'free-trial' | 'payg' | 'subscription'): string {
  if (scenario === 'near-limit') {
    if (accountType === 'free-trial') {
      return '3/3 sessions or 25 min in session';
    } else if (accountType === 'payg') {
      return '15 credits remaining (20%)';
    } else {
      return '960/1200 minutes used (80%)';
    }
  } else { // limit-reached
    if (accountType === 'free-trial') {
      return '30 min limit hit or 3 sessions used';
    } else if (accountType === 'payg') {
      return '0 credits remaining';
    } else {
      return '1200/1200 minutes used (100%)';
    }
  }
}
