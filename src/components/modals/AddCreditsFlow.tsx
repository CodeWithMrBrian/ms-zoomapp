import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { useToast, Toast } from '../ui/Toast';

export interface AddCreditsFlowProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

interface CreditPackage {
  id: string;
  name: string;
  price: number;
  hours: number;
  costPerHour: number;
  recommended?: boolean;
  bestValue?: boolean;
}

// Source credit packages from a config variable for maintainability
import { PRICING_TIERS } from '../../utils/constants';

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: PRICING_TIERS['starter'].id,
    name: PRICING_TIERS['starter'].name,
    price: 39, // TODO: Move to config if these are real product prices
    hours: 10,
    costPerHour: 3.9,
    recommended: true
  },
  {
    id: PRICING_TIERS['professional'].id,
    name: PRICING_TIERS['professional'].name,
    price: 69,
    hours: 20,
    costPerHour: 3.45,
    bestValue: true
  },
  {
    id: PRICING_TIERS['enterprise'].id,
    name: PRICING_TIERS['enterprise'].name,
    price: 99,
    hours: 30,
    costPerHour: 3.3
  }
];

/**
 * AddCreditsFlow Component
 *
 * 3-step modal flow for purchasing credit packages.
 */
export function AddCreditsFlow({ isOpen, onClose, currentBalance }: AddCreditsFlowProps) {
  const { toast, showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('professional');
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zipCode, setZipCode] = useState('');

  const steps = ['Select Package', 'Payment', 'Confirmation'];

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      handlePayment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
    }, 2000);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedPackage('professional');
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setZipCode('');
    onClose();
  };

  const handleComplete = () => {
    showToast('Credits added successfully!', 'success');
    handleClose();
  };

  const selectedPkg = CREDIT_PACKAGES.find(p => p.id === selectedPackage);
  const newBalance = currentBalance + (selectedPkg?.price || 0);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Add Credits
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Current balance: ${currentBalance.toFixed(2)}
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Select Package */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Choose a credit package to add to your account:
                </p>

                <div className="space-y-3">
                  {CREDIT_PACKAGES.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`
                        relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${selectedPackage === pkg.id
                          ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={pkg.id}
                        checked={selectedPackage === pkg.id}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {pkg.name}
                            </span>
                            {pkg.recommended && (
                              <Badge variant="info" size="sm">Recommended</Badge>
                            )}
                            {pkg.bestValue && (
                              <Badge variant="success" size="sm">Best Value</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              ${pkg.price}
                            </p>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {pkg.hours} hours of translation time (${pkg.costPerHour.toFixed(2)}/hour)
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {selectedPkg?.name} Package
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedPkg?.hours} hours
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${selectedPkg?.price}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                    />
                    <Input
                      label="CVC"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      maxLength={3}
                    />
                  </div>

                  <Input
                    label="Billing Zip Code"
                    placeholder="12345"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    maxLength={10}
                  />

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment processing with 256-bit encryption</span>
                  </div>
                </div>
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
                    Payment Successful!
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Your credits have been added to your account.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Package:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPkg?.name} ({selectedPkg?.hours} hours)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Amount Paid:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${selectedPkg?.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">New Balance:</span>
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      ${newBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A receipt has been sent to your email address.
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
                  {currentStep === 1 ? 'Continue' : isProcessing ? 'Processing...' : 'Complete Payment'}
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
