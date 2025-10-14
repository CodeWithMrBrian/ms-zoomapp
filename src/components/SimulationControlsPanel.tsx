
import { useState } from 'react';
import { Button } from './ui';

export interface SimulationState {
  sessionTimeMinutes: number;
  sessionLimit: number | null; // null = unlimited
  sessionsUsed: number;
  sessionsAllowed: number;
  credits: number;
  monthlyMinutesUsed: number;
  monthlyMinutesAllowed: number;
}

export interface SimulationControlsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  accountType: 'free-trial' | 'payg' | 'subscription';
  state: SimulationState;
  onStateChange: (state: Partial<SimulationState>) => void;
  onTriggerModal: (modalType: 'trial-complete' | 'time-limit' | 'no-credits' | 'monthly-limit' | 'upgrade-success') => void;
}

/**
 * Simulation Controls Panel
 *
 * Allows testers to manipulate app state in real-time:
 * - Adjust session time, credits, usage
 * - Trigger conversion modals
 * - Switch between scenarios
 *
 * Only visible in development/test mode
 */
export function SimulationControlsPanel({
  isOpen,
  onToggle,
  accountType,
  state,
  onStateChange,
  onTriggerModal
}: SimulationControlsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Quick scenario presets
  const applyScenario = (scenario: 'near-limit' | 'limit-reached' | 'just-upgraded') => {
    switch (scenario) {
      case 'near-limit':
        if (accountType === 'free-trial') {
          onStateChange({
            sessionTimeMinutes: 25,
            sessionsUsed: 3,
            sessionsAllowed: 3
          });
        } else if (accountType === 'payg') {
          onStateChange({
            credits: 15 // Below 20% of 100
          });
        } else if (accountType === 'subscription') {
          onStateChange({
            monthlyMinutesUsed: 960, // 80% of 1200
            monthlyMinutesAllowed: 1200
          });
        }
        break;

      case 'limit-reached':
        if (accountType === 'free-trial') {
          onStateChange({
            sessionTimeMinutes: 30,
            sessionsUsed: 3,
            sessionsAllowed: 3
          });
        } else if (accountType === 'payg') {
          onStateChange({
            credits: 0
          });
        } else if (accountType === 'subscription') {
          onStateChange({
            monthlyMinutesUsed: 1200,
            monthlyMinutesAllowed: 1200
          });
        }
        break;

      case 'just-upgraded':
        if (accountType === 'payg') {
          onStateChange({
            credits: 100
          });
          onTriggerModal('upgrade-success');
        } else if (accountType === 'subscription') {
          onStateChange({
            monthlyMinutesUsed: 0,
            monthlyMinutesAllowed: 1200
          });
          onTriggerModal('upgrade-success');
        }
        break;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-lg transition-colors flex items-center gap-2"
        title="Open Simulation Controls"
      >
        <span>Simulation</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-900 border-2 border-purple-600 dark:border-purple-500 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span>Simulation Controls</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-purple-200 transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>

          <button
            onClick={onToggle}
            className="text-white hover:text-purple-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Account Status */}
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Account Status
            </div>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
              <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {accountType === 'free-trial' ? 'Free Trial' : accountType === 'payg' ? 'Pay-As-You-Go' : 'Subscription'}
              </div>
            </div>
          </div>

          {/* Session State (Free Trial & All) */}
          {accountType === 'free-trial' && (
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Session State
              </div>

              <div className="space-y-3">
                {/* Time Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Time</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {state.sessionTimeMinutes} / {state.sessionLimit ?? '∞'} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={state.sessionLimit ?? 30}
                    value={state.sessionTimeMinutes}
                    onChange={(e) => onStateChange({ sessionTimeMinutes: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Quick Time Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ sessionTimeMinutes: state.sessionTimeMinutes + 1 })}
                    className="flex-1 text-xs"
                  >
                    +1 min
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ sessionTimeMinutes: state.sessionTimeMinutes + 5 })}
                    className="flex-1 text-xs"
                  >
                    +5 min
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ sessionTimeMinutes: 30 })}
                    className="flex-1 text-xs"
                  >
                    Hit Limit
                  </Button>
                </div>

                {/* Sessions */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Sessions</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {state.sessionsUsed} / {state.sessionsAllowed}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={state.sessionsAllowed}
                    value={state.sessionsUsed}
                    onChange={(e) => onStateChange({ sessionsUsed: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Credits (PAYG only) */}
          {accountType === 'payg' && (
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Credits
              </div>

              <div className="space-y-3">
                {/* Credits Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Credits</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {state.credits} credits
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={state.credits}
                    onChange={(e) => onStateChange({ credits: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Quick Credit Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ credits: 0 })}
                    className="flex-1 text-xs"
                  >
                    Set to 0
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ credits: 5 })}
                    className="flex-1 text-xs"
                  >
                    Set to 5
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ credits: 100 })}
                    className="flex-1 text-xs"
                  >
                    Add 100
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Usage (Subscription only) */}
          {accountType === 'subscription' && (
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Monthly Usage
              </div>

              <div className="space-y-3">
                {/* Usage Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Minutes</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {state.monthlyMinutesUsed} / {state.monthlyMinutesAllowed}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={state.monthlyMinutesAllowed}
                    value={state.monthlyMinutesUsed}
                    onChange={(e) => onStateChange({ monthlyMinutesUsed: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                {/* Quick Usage Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ monthlyMinutesUsed: state.monthlyMinutesAllowed * 0.8 })}
                    className="flex-1 text-xs"
                  >
                    80%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ monthlyMinutesUsed: state.monthlyMinutesAllowed })}
                    className="flex-1 text-xs"
                  >
                    100%
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Trigger Events */}
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Trigger Events
            </div>

            <div className="space-y-2">
              {accountType === 'free-trial' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTriggerModal('trial-complete')}
                    className="w-full text-xs"
                  >
                    Show Trial Complete Modal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTriggerModal('time-limit')}
                    className="w-full text-xs"
                  >
                    Show Time Limit Modal
                  </Button>
                </>
              )}

              {accountType === 'payg' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTriggerModal('no-credits')}
                    className="w-full text-xs"
                  >
                    Show No Credits Modal
                  </Button>
                </>
              )}

              {accountType === 'subscription' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTriggerModal('monthly-limit')}
                    className="w-full text-xs"
                  >
                    Show Monthly Limit Modal
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onTriggerModal('upgrade-success')}
                className="w-full text-xs"
              >
                Simulate Successful Payment
              </Button>
            </div>
          </div>

          {/* Quick Scenarios */}
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Quick Scenarios
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => applyScenario('near-limit')}
                className="flex-1 text-xs"
              >
                Near Limit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => applyScenario('limit-reached')}
                className="flex-1 text-xs"
              >
                Limit Reached
              </Button>
            </div>

            {(accountType === 'payg' || accountType === 'subscription') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => applyScenario('just-upgraded')}
                className="w-full text-xs mt-2"
              >
                Just Upgraded
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
