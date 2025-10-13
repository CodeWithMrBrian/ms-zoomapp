/**
 * ⚠️ DEPRECATED - DO NOT USE ⚠️
 *
 * This component is for the OLD credit-based PAYG system.
 * V1 Pricing uses pure hourly billing (no pre-purchased credits).
 *
 * Users pay for actual hours used at their tier rate each month.
 * No credits to purchase, no balance to track.
 *
 * TO BE DELETED in future cleanup.
 */

import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

export interface AddCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number, credits: number) => void;
  currentBalance: number;
}

/**
 * @deprecated AddCreditsModal - DEPRECATED
 *
 * This was for purchasing prepaid credits for PAYG usage.
 * NOT COMPATIBLE WITH V1 PURE HOURLY BILLING.
 */
export function AddCreditsModal({ isOpen, onClose, onPurchase, currentBalance }: AddCreditsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit packages with bonus credits
  const packages = [
    { amount: 50, credits: 50, bonus: 0, popular: false },
    { amount: 100, credits: 110, bonus: 10, popular: true },
    { amount: 200, credits: 230, bonus: 30, popular: false }
  ];

  const handlePurchase = async () => {
    if (selectedPackage === null) {
      alert('Please select a credit package');
      return;
    }

    const pkg = packages.find(p => p.amount === selectedPackage);
    if (!pkg) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      onPurchase(pkg.amount, pkg.credits);
      setIsProcessing(false);
      setSelectedPackage(null);
      alert(`Successfully added $${pkg.credits} in credits to your account!`);
    }, 1500);
  };

  const handleCancel = () => {
    setSelectedPackage(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add Credits"
      size="lg"
    >
      <div className="space-y-6">
        {/* Current Balance */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Balance
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${currentBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-2">
            Pay-As-You-Go Pricing
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>Starter: $45/hour - 3 languages</li>
            <li>Professional: $75/hour - 7 languages</li>
            <li>Enterprise: $95/hour - ALL languages (50+)</li>
          </ul>
        </div>

        {/* Credit Packages */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Credit Package
          </label>

          {packages.map((pkg) => (
            <div
              key={pkg.amount}
              onClick={() => setSelectedPackage(pkg.amount)}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPackage === pkg.amount
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              } ${pkg.popular ? 'ring-2 ring-teal-400 dark:ring-teal-600' : ''}`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="success">Most Popular</Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                {/* Radio Button */}
                <input
                  type="radio"
                  name="package"
                  checked={selectedPackage === pkg.amount}
                  onChange={() => setSelectedPackage(pkg.amount)}
                  className="w-5 h-5 text-teal-600"
                />

                {/* Package Details */}
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      ${pkg.amount}
                    </span>
                    {pkg.bonus > 0 && (
                      <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                        +${pkg.bonus} bonus
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get ${pkg.credits} in credits
                  </p>
                </div>

                {/* Value Indicator */}
                <div className="text-right">
                  <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    ${pkg.credits}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    total credits
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Package Summary */}
        {selectedPackage !== null && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            {(() => {
              const pkg = packages.find(p => p.amount === selectedPackage);
              if (!pkg) return null;

              const newBalance = currentBalance + pkg.credits;
              const estimatedHours = {
                starter: (newBalance / 45).toFixed(1),
                professional: (newBalance / 75).toFixed(1),
                enterprise: (newBalance / 95).toFixed(1)
              };

              return (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    After Purchase:
                  </p>
                  <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <p>New Balance: <strong>${newBalance.toFixed(2)}</strong></p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Approximately {estimatedHours.starter}hrs (Starter), {estimatedHours.professional}hrs (Professional), or {estimatedHours.enterprise}hrs (Enterprise)
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Payment Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Payments are processed securely via Stripe. Credits never expire and can be used across all tiers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="primary" size="lg"
            onClick={handlePurchase}
            className="flex-1"
            disabled={selectedPackage === null || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Purchase ${selectedPackage ? `$${selectedPackage}` : 'Credits'}`
            )}
          </Button>
          <Button variant="secondary" size="md"
            onClick={handleCancel}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
