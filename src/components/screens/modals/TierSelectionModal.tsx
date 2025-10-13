import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { pricingConfig } from '../../../utils/pricingManager';
import { SubscriptionTier } from '../../../types';
import { useUser } from '../../../context/UserContext';
import { canChangeTier, getNextTierChangeDate, formatTierLockMessage } from '../../../utils/tierLockUtils';

/**
 * TierSelectionModal (Screen 4)
 *
 * Modal for selecting/upgrading PAYG tier.
 * Can be triggered from:
 * - Language selection (when tier limit reached)
 * - Account settings
 * - Session setup
 *
 * Features:
 * - Compare all three PAYG tiers side-by-side
 * - Highlight recommended tier
 * - Show feature differences
 * - Clear PAYG pricing display
 */

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: SubscriptionTier | null;
  onSelectTier: (tier: SubscriptionTier, billingType: 'payg') => void;
  onManagePayment?: () => void;
  context?: 'upgrade' | 'initial' | 'language_limit';
}

export function TierSelectionModal({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
  onManagePayment,
  context = 'initial'
}: TierSelectionModalProps) {
  const { user } = useUser();
  const billingType = 'payg'; // PAYG only - subscription removed
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(currentTier || null);

  // Get modal title based on context and payment status
  const getTitle = () => {
    if (context === 'upgrade') return 'Upgrade Your Plan';
    if (context === 'language_limit') return 'Upgrade to Add More Languages';
    
    // If user has payment method, they're changing/selecting tier
    if (user?.payment_method_added) {
      if (currentTier) {
        return 'Change Your Tier';
      } else {
        return 'Select Your Tier';
      }
    }
    
    // If no payment method, this is initial pricing
    return 'MeetingSync Pricing';
  };

  // Get modal description based on context and payment status
  const getDescription = () => {
    if (context === 'upgrade') return 'Select a higher tier to access more features and languages.';
    if (context === 'language_limit') return 'Your current plan has reached its language limit. Upgrade to add more languages.';
    
    // If user has payment method, they're selecting/changing tier
    if (user?.payment_method_added) {
      if (currentTier) {
        return 'Change your current tier to better match your needs. Changes apply to new billing periods.';
      } else {
        return 'Select your tier for this billing period. You can change it next month if needed.';
      }
    }
    
    // If no payment method, this is initial setup
    return 'Choose a plan to get started. You\'ll add your payment method next, then select your tier when you start your first session.';
  };

  // Handle tier selection and confirmation 
  const handleConfirm = () => {
    // Check if user is trying to change tiers but is locked in
    if (user?.payment_method_added && currentTier && selectedTier && 
        selectedTier !== currentTier && !canChangeTier(user.tier_selected_date)) {
      // User is locked into current tier - can't change yet
      return;
    }

    if (selectedTier) {
      // User selected a tier - proceed with tier selection flow
      onSelectTier(selectedTier, billingType);
    } else {
      // User wants to add payment without selecting tier first
      // Use starter as placeholder for payment flow - actual tier selection happens on first session
      onSelectTier('starter', billingType);
    }
    // Note: onClose() not needed here because handleSelectTier in App.tsx already handles modal closing
  };

  const tiers: SubscriptionTier[] = ['starter', 'professional', 'enterprise'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <div className="space-y-6">
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {getDescription()}
        </p>

        {/* PAYG Info Banner */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-2 text-center">
            Simple Pay-As-You-Go Pricing
          </h3>
          <ul className="space-y-1 text-xs text-teal-800 dark:text-teal-200">
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Add payment method (no upfront charge)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Select your tier when starting first session each month</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Pay only for actual hours used at your tier rate</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Change tier monthly as your needs change</span>
            </li>
          </ul>
        </div>

        {/* Pricing Details Button */}
        <div className="text-center">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              alert(`💰 PRICING DETAILS:\n\n` +
                `🔸 STARTER: $39/hour - Up to 3 languages\n` +
                `• Language overage: +$10/hour per extra language\n` +
                `• Participant base: 25 people included\n` +
                `• Participant overage: +25% per 100 over base\n\n` +
                `🔸 PROFESSIONAL: $69/hour - Up to 8 languages\n` +
                `• Language overage: +$8/hour per extra language\n` +
                `• Participant base: 100 people included\n` +
                `• Participant overage: +25% per 100 over base\n\n` +
                `🔸 ENTERPRISE: $99/hour - Unlimited languages\n` +
                `• Language overage: None (unlimited)\n` +
                `• Participant base: 500 people included\n` +
                `• Participant overage: +25% per 100 over base\n\n` +
                `💡 BILLING:\n` +
                `• No setup fees or monthly minimums\n` +
                `• Pay only for actual session hours\n` +
                `• All overages calculated per session hour\n` +
                `• Change tiers monthly on the 1st`);
            }}
            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Full Pricing Details
          </Button>
        </div>

        {/* Tier Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map(tier => {
            const tierData = pricingConfig.getPaygTier(tier);
            if (!tierData) return null;
            const isSelected = selectedTier === tier;
            const isRecommended = tierData.recommended || tier === 'professional';
            const isCurrent = currentTier === tier;

            return (
              <Card
                key={tier}
                variant={isSelected ? 'selected' : 'hover'}
                padding="lg"
                onClick={() => setSelectedTier(tier)}
                className={`cursor-pointer relative ${isRecommended ? 'border-2 border-teal-500 dark:border-teal-400' : ''}`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="success" className="px-4 py-1">
                      Recommended
                    </Badge>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="info">Current Plan</Badge>
                  </div>
                )}

                <CardContent>
                  <div className="space-y-4">
                    {/* Tier Name */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                      {tierData.name}
                    </h3>

                    {/* Pricing */}
                    <div className="text-center border-y border-gray-200 dark:border-gray-700 py-4">
                      <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                        {pricingConfig.formatHourlyRate(tierData.baseRatePerHour)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        per hour
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        No monthly commitment
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 text-sm">
                      {tierData.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Ideal For */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                        Ideal for:
                      </p>
                      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        {tierData.idealFor.map((use: string, index: number) => (
                          <li key={index}>• {use}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="text-center pt-2">
                        <div className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold">
                          <span>Selected</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>


        {/* Additional Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            All plans include unlimited sessions, real-time translation, PDF transcripts, custom glossaries, and flexible tier switching. Pay only for hours used with participant multiplier (25% per 100 over 100).
          </p>
        </div>

        {/* Payment Method Info (if payment method exists) */}
        {user?.payment_method_added && user?.payment_method && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Payment Method: {user.payment_method}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    Ready for pay-as-you-go billing
                  </div>
                </div>
              </div>
              {onManagePayment && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onManagePayment}
                  className="text-xs"
                >
                  Manage
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Tier Lock-in Messaging for PAYG Users */}
        {user?.payment_method_added && currentTier && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Monthly Tier Lock-in Period
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-200 mb-2">
                  {formatTierLockMessage(user.tier_selected_date)}
                </p>
                {!canChangeTier(user.tier_selected_date) && (
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Next tier change available: <strong>{getNextTierChangeDate().toLocaleDateString()}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            className="flex-1"
            disabled={(() => {
              // Disable if user is trying to change tiers but is locked in
              if (user?.payment_method_added && currentTier && selectedTier && 
                  selectedTier !== currentTier && !canChangeTier(user.tier_selected_date)) {
                return true;
              }
              return false;
            })()}
          >
            {(() => {
              // Check if user is locked into current tier
              const isLockedIn = user?.payment_method_added && currentTier && selectedTier && 
                                selectedTier !== currentTier && !canChangeTier(user.tier_selected_date);
              
              if (isLockedIn) {
                return `Locked Until ${getNextTierChangeDate().toLocaleDateString()}`;
              }
              
              if (context === 'upgrade') {
                if (selectedTier && pricingConfig.getPaygTier(selectedTier)?.name) {
                  return `Upgrade to ${pricingConfig.getPaygTier(selectedTier)?.name}`;
                }
                return 'Upgrade to Pay-As-You-Go Plan';
              }
              
              // If user has payment method, this is tier selection/change
              if (user?.payment_method_added) {
                if (selectedTier) {
                  return currentTier 
                    ? `Change to ${pricingConfig.getPaygTier(selectedTier)?.name}`
                    : `Select ${pricingConfig.getPaygTier(selectedTier)?.name}`;
                } else {
                  return currentTier ? 'Change Tier Selection' : 'Select Tier';
                }
              }
              
              // If no payment method, this is the initial setup
              return 'Upgrade to Pay-As-You-Go Plan';
            })()}
          </Button>
          <Button variant="secondary" size="lg" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
