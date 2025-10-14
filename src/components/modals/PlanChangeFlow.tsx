/**
 * ⚠️ DEPRECATED - DO NOT USE ⚠️
 *
 * This component is for the OLD subscription-based pricing model.
 * V1 Pricing uses PAYG-only (no subscriptions, no monthly plans).
 *
 * This file is kept for reference only and should NOT be imported anywhere.
 * Use TierSelectionModal.tsx instead for PAYG tier selection.
 *
 * TO BE DELETED in future cleanup.
 */

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { useToast, Toast } from '../ui/Toast';
import { PRICING_TIERS } from '../../utils/constants';

export interface PlanChangeFlowProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
}

/**
 * @deprecated PlanChangeFlow Component - DEPRECATED
 *
 * This was a 3-step modal flow for changing subscription plans.
 * NOT COMPATIBLE WITH V1 PAYG-ONLY PRICING.
 */
export function PlanChangeFlow({ isOpen, onClose, currentPlan }: PlanChangeFlowProps) {
  const { toast, showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [billingOption, setBillingOption] = useState<'immediate' | 'renewal'>('immediate');
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = ['Compare Plans', 'Billing Options', 'Confirmation'];

  const plans = Object.values(PRICING_TIERS);
  const currentPlanData = PRICING_TIERS[currentPlan];
  const selectedPlanData = PRICING_TIERS[selectedPlan];

  const isUpgrade = selectedPlanData.monthly_subscription > currentPlanData.monthly_subscription;
// ...existing code...

  const priceDifference = selectedPlanData.monthly_subscription - currentPlanData.monthly_subscription;
  const proratedAmount = billingOption === 'immediate' ? Math.abs(priceDifference) * 0.5 : 0; // Simplified proration

  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedPlan === currentPlan) {
        showToast('Please select a different plan', 'warning');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!confirmationChecked) {
        showToast('Please confirm the billing changes', 'warning');
        return;
      }
      handleConfirm();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate plan change processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
    }, 2000);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedPlan(currentPlan);
    setBillingOption('immediate');
    setConfirmationChecked(false);
    onClose();
  };

  const handleComplete = () => {
    showToast('Plan changed successfully!', 'success');
    handleClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Change Subscription Plan
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Current plan: {currentPlanData.name}
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="min-h-[500px]">
            {/* Step 1: Compare Plans */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Compare plans and select your new subscription:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => {
                    const isCurrent = plan.id === currentPlan;
                    const isSelected = plan.id === selectedPlan;
                    const isUpgradeOption = plan.monthly_subscription > currentPlanData.monthly_subscription;
                    const isDowngradeOption = plan.monthly_subscription < currentPlanData.monthly_subscription;

                    return (
                      <label
                        key={plan.id}
                        className={`
                          relative flex flex-col p-5 border-2 rounded-lg cursor-pointer transition-all
                          ${isSelected
                            ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                          }
                          ${isCurrent ? 'ring-2 ring-teal-200 dark:ring-teal-800' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={isSelected}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="sr-only"
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {plan.name}
                          </h3>
                          {isCurrent && (
                            <Badge variant="info" size="sm">Current</Badge>
                          )}
                          {!isCurrent && isUpgradeOption && (
                            <Badge variant="success" size="sm">Upgrade</Badge>
                          )}
                          {!isCurrent && isDowngradeOption && (
                            <Badge variant="warning" size="sm">Downgrade</Badge>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            ${plan.monthly_subscription}
                            <span className="text-base font-normal text-gray-600 dark:text-gray-400">/mo</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {plan.hours_included} hours included
                          </p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-4 flex-1">
                          {plan.features.slice(0, 4).map((feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {isSelected && !isCurrent && (
                          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {isUpgradeOption ? 'Upgrade' : 'Downgrade'} to this plan
                            </p>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Billing Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {currentPlanData.name} → {selectedPlanData.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isUpgrade ? 'Upgrading' : 'Downgrading'} your subscription
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    When should this change take effect?
                  </p>

                  {/* Billing Option 1: Immediate */}
                  <label
                    className={`
                      flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${billingOption === 'immediate'
                        ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="billing"
                      value="immediate"
                      checked={billingOption === 'immediate'}
                      onChange={(e) => setBillingOption(e.target.value as 'immediate')}
                      className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Change immediately (prorated)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your plan will change now. You'll be {isUpgrade ? 'charged' : 'credited'} a prorated amount.
                      </p>
                      {billingOption === 'immediate' && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Prorated {isUpgrade ? 'charge' : 'credit'}: ${proratedAmount.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Billing Option 2: At Renewal */}
                  <label
                    className={`
                      flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${billingOption === 'renewal'
                        ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="billing"
                      value="renewal"
                      checked={billingOption === 'renewal'}
                      onChange={(e) => setBillingOption(e.target.value as 'renewal')}
                      className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Change at next renewal
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your plan will change on your next billing date (November 10, 2025). No charges today.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Cost Breakdown
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Current plan:</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        ${currentPlanData.monthly_subscription}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">New plan:</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        ${selectedPlanData.monthly_subscription}/mo
                      </span>
                    </div>
                    {billingOption === 'immediate' && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">
                          {isUpgrade ? 'Charge today:' : 'Credit today:'}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ${proratedAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Next billing amount:
                      </span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">
                        ${selectedPlanData.monthly_subscription}/mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <Checkbox
                  id="confirm-change"
                  checked={confirmationChecked}
                  onChange={(e) => setConfirmationChecked(e.target.checked)}
                  label="I understand the billing changes and want to proceed"
                />
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20">
                  <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Plan Changed Successfully!
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Your subscription has been updated.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">New Plan:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPlanData.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Monthly Cost:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${selectedPlanData.monthly_subscription}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Hours Included:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPlanData.hours_included} hours/mo
                    </span>
                  </div>
                  {billingOption === 'immediate' && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">
                        {isUpgrade ? 'Charged Today:' : 'Credited Today:'}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ${proratedAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Next Billing Date:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {billingOption === 'immediate' ? 'November 10, 2025' : 'November 10, 2025'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {currentStep < 3 ? (
              <>
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? handleClose : handleBack}
                  disabled={isProcessing}
                >
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                  onClick={handleNext}
                  isLoading={isProcessing}
                  disabled={isProcessing}
                >
                  {currentStep === 1 ? 'Continue' : isProcessing ? 'Processing...' : 'Confirm Change'}
                </Button>
              </>
            ) : (
              <Button onClick={handleComplete} className="ml-auto">
                Done
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Toast {...toast} />
    </>
  );
}
