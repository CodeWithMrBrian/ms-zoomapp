import { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodAdded: () => void;
  selectedTier?: string;
  context?: 'add' | 'update'; // New prop to distinguish between adding and updating
}

/**
 * AddPaymentMethodModal - Add credit card for postpaid PAYG billing
 *
 * Pure postpaid model:
 * - User adds card (no charge)
 * - Usage tracked during sessions
 * - Billed automatically at end of month
 * - No upfront payment required
 */
export function AddPaymentMethodModal({
  isOpen,
  onClose,
  onPaymentMethodAdded,
  selectedTier = 'professional',
  context = 'add'
}: AddPaymentMethodModalProps) {
  // Prefilled with mock data for quick testing
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12/26');
  const [cvv, setCvv] = useState('123');
  const [name, setName] = useState('John Doe');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset form with prefilled mock data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCardNumber('4242 4242 4242 4242');
      setExpiryDate('12/26');
      setCvv('123');
      setName('John Doe');
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setCvv(cleaned.slice(0, 4)); // Max 4 digits for Amex
  };

  const handleSubmit = async () => {
    // Validation
    if (!cardNumber || !expiryDate || !cvv || !name) {
      alert('Please fill in all payment details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 15) {
      alert('Please enter a valid card number');
      return;
    }

    if (expiryDate.length !== 5) {
      alert('Please enter expiry date as MM/YY');
      return;
    }

    if (cvv.length < 3) {
      alert('Please enter a valid CVV');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe Setup Intent validation (takes 2-3 seconds)
    setTimeout(() => {
      setIsProcessing(false);

      // Reset form (cleanup)
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setName('');

      // Trigger parent callback (handles success message and navigation)
      onPaymentMethodAdded();
    }, 2500);
  };

  const handleCancel = () => {
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setName('');
    setIsProcessing(false);
    onClose();
  };

  // Get tier details for display
  const tierDetails = {
    starter: { name: 'Starter', rate: 45, languages: '1 translation (2 total languages)' },
    professional: { name: 'Professional', rate: 75, languages: '5 translations (6 total languages)' },
    enterprise: { name: 'Enterprise', rate: 105, languages: '15 translations (16 total languages)' }
  }[selectedTier] || { name: 'Professional', rate: 75, languages: '5 translations (6 total languages)' };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={context === 'update' ? 'Update Payment Method' : 'Add Payment Method'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Postpaid PAYG Explanation */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-2">
            Pay-As-You-Go Billing
          </h3>
          <ul className="space-y-1 text-sm text-teal-800 dark:text-teal-200">
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>No upfront payment - start using immediately</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Billed monthly for actual usage only</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Cancel anytime - no commitment required</span>
            </li>
          </ul>
        </div>

        {/* Pricing Overview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Choose Your Tier on First Session
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span>Starter (1 translation, 2 total)</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">$45/hr</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Professional (5 translations, 6 total)</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">$75/hr</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Enterprise (15 translations, 16 total)</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">$105/hr</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            You'll select your tier when starting your first session
          </p>
        </div>

        {/* Card Details Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Credit/Debit Card Details
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              Test data prefilled
            </span>
          </div>

          {/* Card Number */}
          <Input
            label="Card Number"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            disabled={isProcessing}
            required
          />

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryChange}
              disabled={isProcessing}
              required
            />
            <Input
              label="CVV"
              type="text"
              placeholder="123"
              value={cvv}
              onChange={handleCvvChange}
              disabled={isProcessing}
              required
            />
          </div>

          {/* Cardholder Name */}
          <Input
            label="Cardholder Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isProcessing}
            required
          />
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            <strong>🔒 Secure Payment:</strong> Your card details are encrypted and processed securely via Stripe.
            We never store your full card number.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Validating Card...</span>
              </div>
            ) : (
              'Add Payment Method'
            )}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>

        {/* Fine Print */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          By adding your payment method, you agree to be billed automatically for your usage
          at the end of each billing period. No charge will be made until you use the service.
        </p>
      </div>
    </Modal>
  );
}
