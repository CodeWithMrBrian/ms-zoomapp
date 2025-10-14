// ...existing code...
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
// ...existing code...
import { Badge } from '../../ui/Badge';
import { useUser } from '../../../context/UserContext';
import { formatCurrency } from '../../../utils/constants';

/**
 * UsageWarningModal (Screen 5)
 *
 * Warning modal shown when user has high unpaid usage in postpaid PAYG model.
 * Triggered when:
 * - PAYG user exceeds $150 unpaid usage threshold
 * - User is approaching end of billing period with high usage
 *
 * Features:
 * - Current billing period usage visualization
 * - Estimated cost of upcoming session (V1: includes participant multiplier + overages)
 * - Payment method reminder
 * - Allow session to continue (postpaid model)
 *
 * NOTE: The estimatedSessionCost parameter should be calculated using V1 pricing:
 * - Base: tier_rate × duration × participant_multiplier
 * - Overages: overage_rate × overage_count × duration × participant_multiplier
 * - Total: base + overages
 */

export type UsageWarningType = 'high_usage' | 'payment_reminder';

interface UsageWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  warningType: UsageWarningType;
  estimatedSessionCost?: number;
  onContinue?: () => void;
  onManagePayment?: () => void;
}

export function UsageWarningModal({
  isOpen,
  onClose,
  warningType,
  estimatedSessionCost = 0,
  onContinue,
  onManagePayment
}: UsageWarningModalProps) {
  const { user } = useUser();

  if (!user) return null;

  // Warning content configuration
  const warningContent = {
    high_usage: {
      icon: '⚠️',
      title: 'High Usage Alert',
      severity: 'warning' as const,
      message: `Your unpaid usage of ${formatCurrency(user.unpaid_usage || 0)} will be billed at the end of this month.`,
      canContinue: true
    },
    payment_reminder: {
      icon: '💳',
      title: 'Payment Method Reminder',
      severity: 'info' as const,
      message: 'Your payment method will be automatically charged at the end of the billing period.',
      canContinue: true
    }
  };

  const content = warningContent[warningType];

  // Safety check: if warningType is invalid, don't render
  if (!content) {
    console.error(`[UsageWarningModal] Invalid warningType: ${warningType}`);
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={content.title}
      size="md"
    >
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="text-center space-y-4">
          <div className="text-6xl">{content.icon}</div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {content.message}
          </p>
        </div>

        {/* Current Billing Period Usage (PAYG Postpaid) */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Current Month Usage</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {formatCurrency(user.unpaid_usage || 0)}
            </span>
          </div>

          {user.billing_period_start && user.billing_period_end && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Billing Period: {user.billing_period_start} to {user.billing_period_end}
            </div>
          )}

          {estimatedSessionCost > 0 && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Estimated session cost:
                  </span>
                  <Badge variant="warning" className="text-base">
                    {formatCurrency(estimatedSessionCost)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-700 dark:text-gray-300">
                    Total after session:
                  </span>
                  <span className="text-base text-teal-600 dark:text-teal-400">
                    {formatCurrency((user.unpaid_usage || 0) + estimatedSessionCost)}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Payment Method:</strong> {user.payment_method || 'Not set'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Automatic charge at end of billing period
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Continue Button (always allowed in postpaid model) */}
          {onContinue && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                onContinue();
                onClose();
              }}
              className="w-full"
            >
              Continue Session
            </Button>
          )}

          {/* Manage Payment Method */}
          <div className="flex gap-3">
            {onManagePayment && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  onManagePayment();
                  onClose();
                }}
                className="flex-1"
              >
                Manage Payment Method
              </Button>
            )}

            {/* Cancel */}
            <Button
              variant="secondary"
              size="lg"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => window.open('https://meetingsync.app/pricing', '_blank')}
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
          >
            Learn more about pricing →
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Postpaid Billing:</strong> Continue using MeetingSync without interruption. You'll be automatically billed at the end of your billing period.
          </p>
        </div>
      </div>
    </Modal>
  );
}
