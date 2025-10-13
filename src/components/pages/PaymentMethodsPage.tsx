import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useToast, Toast } from '../ui/Toast';
import { MOCK_PAYMENT_METHODS, PaymentMethod } from '../../utils/mockPaymentMethods';

export interface PaymentMethodsPageProps {
  onBack: () => void;
}

/**
 * PaymentMethodsPage Component
 *
 * Displays and manages user's payment methods (credit cards).
 * Features:
 * - List of payment methods with card details
 * - Card brand icons (Visa, Mastercard, Amex)
 * - Default badge indicator
 * - Set as Default button
 * - Delete button with confirmation modal
 * - Add new card button (mockup)
 * - Empty state
 */
export function PaymentMethodsPage({ onBack }: PaymentMethodsPageProps) {
  const { toast, showToast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    methodId: string | null;
  }>({ isOpen: false, methodId: null });

  // Breadcrumbs navigation
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: () => onBack() },
    { label: 'Account', onClick: () => onBack() },
    { label: 'Payment Methods' }
  ];

  // Get card brand icon
  const getCardBrandIcon = (brand: string) => {
    const icons: Record<string, string> = {
      visa: 'text-blue-600',
      mastercard: 'text-orange-600',
      amex: 'text-green-600',
      discover: 'text-purple-600'
    };

    return (
      <div
        className={`w-12 h-8 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center ${
          icons[brand] || 'text-gray-600'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>
    );
  };

  // Get card brand name
  const getCardBrandName = (brand: string) => {
    const names: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover'
    };
    return names[brand] || brand.toUpperCase();
  };

  // Action handlers
  const handleSetAsDefault = (methodId: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        is_default: method.id === methodId
      }))
    );
    showToast('Default payment method updated', 'success');
  };

  const handleDeleteClick = (methodId: string) => {
    setDeleteConfirmation({ isOpen: true, methodId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.methodId) {
      setPaymentMethods((methods) =>
        methods.filter((method) => method.id !== deleteConfirmation.methodId)
      );
      showToast('Payment method deleted', 'success');
    }
    setDeleteConfirmation({ isOpen: false, methodId: null });
  };

  const handleAddNewCard = () => {
    showToast('Add new card feature coming soon', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="tertiary" onClick={onBack} className="gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Account
          </Button>
        </div>

        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Payment Methods
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your credit cards and payment methods
            </p>
          </div>

          <Button variant="primary" onClick={handleAddNewCard}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Card
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {paymentMethods.length === 0 ? (
          // Empty State
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No payment methods
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add a credit card to start using MeetingSync
                  </p>
                  <Button variant="primary" onClick={handleAddNewCard}>
                    Add Your First Card
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Payment Methods List
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} variant="hover">
                <CardContent>
                  <div className="flex items-center justify-between">
                    {/* Card Info */}
                    <div className="flex items-center gap-4">
                      {/* Card Brand Icon */}
                      {getCardBrandIcon(method.brand)}

                      {/* Card Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {getCardBrandName(method.brand)} ****{method.last4}
                          </p>
                          {method.is_default && (
                            <Badge variant="info" size="sm">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            Expires {method.exp_month.toString().padStart(2, '0')}/{method.exp_year}
                          </span>
                          {method.cardholder_name && (
                            <>
                              <span>•</span>
                              <span>{method.cardholder_name}</span>
                            </>
                          )}
                        </div>
                        {method.billing_address && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {method.billing_address.city}, {method.billing_address.state}{' '}
                            {method.billing_address.postal_code}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!method.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetAsDefault(method.id)}
                        >
                          Set as Default
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(method.id)}
                        disabled={method.is_default && paymentMethods.length === 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Security Notice */}
        {paymentMethods.length > 0 && (
          <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Your payment information is secure
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  All payment data is encrypted and processed securely through Stripe. We never store
                  your full card number.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, methodId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment Method?"
        message="This payment method will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Toast notifications */}
      <Toast {...toast} />
    </div>
  );
}
