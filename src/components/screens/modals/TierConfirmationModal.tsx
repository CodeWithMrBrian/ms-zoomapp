import React from 'react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { pricingConfig } from '../../../utils/pricingManager';

interface TierConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedTier: string;
  isChangingTier?: boolean;
}

export const TierConfirmationModal: React.FC<TierConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedTier,
  isChangingTier = false
}) => {
  if (!isOpen) return null;

  const tierData = pricingConfig.getPaygTier(selectedTier);
  const tierDisplayName = tierData?.name || selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);
  
  const nextChangeDate = new Date();
  nextChangeDate.setMonth(nextChangeDate.getMonth() + 1, 1); // 1st of next month
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isChangingTier ? 'Change Tier Confirmation' : 'Tier Selection Confirmation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Warning Box */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 14h.01M12 14h.01M12 12h.01M9 18h.01M15 18h.01M9 20h.01M15 20h.01M9 16h.01M15 16h.01M9 14h.01M15 14h.01M7 8h10l-1 12H8L7 8z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    Monthly Lock-in Period
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Once you {isChangingTier ? 'change to' : 'select'} the <strong>{tierDisplayName}</strong> tier, 
                    you cannot change it again until <strong>{formatDate(nextChangeDate)}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Tier Details */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {isChangingTier ? 'New Tier:' : 'Selected Tier:'} {tierDisplayName}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {tierData && (
                  <>
                    <p>• Base rate: {tierData.baseRatePerHour ? `$${tierData.baseRatePerHour}/hour` : 'Contact for pricing'}</p>
                    <p>• {tierData.translationLimit} target language{tierData.translationLimit !== 1 ? 's' : ''}</p>
                    <p>• Overage: {tierData.overageRatePerHour ? `$${tierData.overageRatePerHour}/hour per extra language` : 'Contact for pricing'}</p>
                  </>
                )}
              </div>
            </div>

            {/* Important Notice */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                <strong>Important:</strong> This tier selection will apply to all your translation sessions 
                for the current billing period.
              </p>
              <p>
                You'll be able to select a new tier starting on the 1st of every month.
              </p>
            </div>

            {/* Pricing Details Link */}
            <div className="pt-3 text-center">
              <button
                onClick={() => {
                  alert(`💰 COMPLETE PRICING BREAKDOWN:\n\n` +
                    `🔸 STARTER TIER: $39/hour\n` +
                    `• Up to 3 target languages included\n` +
                    `• Language overage: +$10/hour per extra language\n` +
                    `• Participant base: 25 people included\n` +
                    `• Participant overage: +25% per 100 over base\n\n` +
                    `🔸 PROFESSIONAL TIER: $69/hour\n` +
                    `• Up to 8 target languages included\n` +
                    `• Language overage: +$8/hour per extra language\n` +
                    `• Participant base: 100 people included\n` +
                    `• Participant overage: +25% per 100 over base\n\n` +
                    `🔸 ENTERPRISE TIER: $99/hour\n` +
                    `• Unlimited target languages (no overage)\n` +
                    `• Participant base: 500 people included\n` +
                    `• Participant overage: +25% per 100 over base\n\n` +
                    `📋 BILLING DETAILS:\n` +
                    `• Billed monthly for actual usage\n` +
                    `• No setup fees or cancellation charges\n` +
                    `• All overages calculated per session hour\n` +
                    `• Tier changes allowed on the 1st of each month`);
                }}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium underline hover:no-underline transition-all"
              >
                View Complete Pricing Details
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1"
          >
            {isChangingTier ? 'Confirm Tier Change' : 'Confirm Selection'}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};