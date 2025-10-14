import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useUser } from '../../../context/UserContext';

export interface ManagePaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePaymentMethod: () => void;
}

/**
 * ManagePaymentMethodModal - Manage existing payment methods
 *
 * Features:
 * - Show current payment method
 * - Option to update/change payment method
 * - Option to remove payment method
 * - Clear actions for payment management
 */
export function ManagePaymentMethodModal({
  isOpen,
  onClose,
  onUpdatePaymentMethod
}: ManagePaymentMethodModalProps) {
  const { user, setPaymentMethodAdded } = useUser();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdatePaymentMethod = () => {
    onClose();
    onUpdatePaymentMethod();
  };

  const handleRemovePaymentMethod = async () => {
    if (!confirm(
      'Are you sure you want to remove your payment method?\n\n' +
      'This will:\n' +
      '• End your current PAYG access\n' +
      '• Switch you back to the Daily Free Tier (15 min/day)\n' +
      '• Cancel any active tier selection\n\n' +
      'You can always add a payment method again later.'
    )) {
      return;
    }

    setIsRemoving(true);

    // Simulate API call
    setTimeout(() => {
      setPaymentMethodAdded(false);
      setIsRemoving(false);
      onClose();
      
      alert(
        'Payment Method Removed Successfully\n\n' +
        'You\'ve been switched back to the Daily Free Tier.\n' +
        'You can add a payment method anytime to access PAYG pricing.'
      );
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Payment Method" size="md">
      <div className="space-y-6">
        {/* Current Payment Method */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                Current Payment Method
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                {user?.payment_method || 'Visa ****1234'}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Active since {new Date().toLocaleDateString()} • Used for PAYG billing
              </p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Account Status
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>Pay-As-You-Go billing enabled</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>
                Current tier: {user?.subscription_tier 
                  ? `${user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)}`
                  : 'None selected (choose when starting session)'
                }
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>Monthly billing • No upfront charges</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleUpdatePaymentMethod}
            className="w-full"
          >
            Update Payment Method
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleRemovePaymentMethod}
            isLoading={isRemoving}
            className="w-full"
          >
            {isRemoving ? 'Removing...' : 'Remove Payment Method'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Removing your payment method will switch you back to the Daily Free Tier 
            (15 minutes per day). Any active tier selection will be cancelled.
          </p>
        </div>
      </div>
    </Modal>
  );
}