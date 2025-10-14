import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
// ProgressBar import removed as unused
import { useUser } from '../../context/UserContext';
import { MOCK_INVOICES } from '../../utils/mockData';
import { formatCurrency, formatDate, PRICING_TIERS } from '../../utils/constants';
import { InvoiceDetailPage } from '../pages/InvoiceDetailPage';
import { PaymentMethodsPage } from '../pages/PaymentMethodsPage';

/**
 * AccountTab Component
 *
 * Display billing information and PAYG management.
 *
 * Features:
 * - Current PAYG plan/credit balance display
 * - Transaction history
 * - Invoice history with download
 * - Payment method management
 * - Tier changes (Starter/Professional/Enterprise)
 */

type AccountView = 'main' | 'invoice-detail' | 'payment-methods';

export interface AccountTabProps {
  onAddPaymentMethod?: () => void; // Callback to open AddPaymentMethodModal in App.tsx
}

export function AccountTab({ onAddPaymentMethod }: AccountTabProps = {}) {
  const { user, isPAYG } = useUser();
  const [currentView, setCurrentView] = useState<AccountView>('main');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Handle viewing invoice detail
  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setCurrentView('invoice-detail');
  };

  // Handle opening payment methods page
  const handleManagePaymentMethods = () => {
    setCurrentView('payment-methods');
  };

  // Handle adding payment method (opens modal in App.tsx for free trial users)
  const handleAddPaymentMethod = () => {
    if (onAddPaymentMethod) {
      // For free trial users: open AddPaymentMethodModal
      onAddPaymentMethod();
    } else {
      // Fallback: navigate to payment methods page
      setCurrentView('payment-methods');
    }
  };

  // Handle back to main view
  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedInvoiceId(null);
  };

  // Render sub-pages
  if (currentView === 'invoice-detail' && selectedInvoiceId) {
    return (
      <InvoiceDetailPage
        invoiceId={selectedInvoiceId}
        onBack={handleBackToMain}
      />
    );
  }

  if (currentView === 'payment-methods') {
    return (
      <PaymentMethodsPage onBack={handleBackToMain} />
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-8">
        No user data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Free Trial Status */}
      {user.is_free_trial_active && (user.free_trial_sessions_remaining ?? 0) > 0 && (
        <Card variant="beautiful" padding="lg">
          <CardHeader>
            <CardTitle>Free Trial Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {user.free_trial_sessions_remaining || 0} Sessions Remaining
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.free_trial_sessions_used || 0} of 3 trial sessions used
                  </p>
                </div>
                <Badge variant="success">Free Trial</Badge>
              </div>

              {/* Trial Features */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-teal-600 dark:text-teal-400">✓</span>
                    <span>1 translation (2 total languages) per session</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-teal-600 dark:text-teal-400">✓</span>
                    <span>30 minutes per session (90 minutes total)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-teal-600 dark:text-teal-400">✓</span>
                    <span>Full MeetingSync features</span>
                  </li>
                </ul>
              </div>

              {/* Trial Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="primary" onClick={() => alert('Upgrade to paid plan coming soon!')}>
                  Choose Paid Plan
                </Button>
                <Button variant="secondary" onClick={handleAddPaymentMethod}>
                  Add Payment Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Trial Complete - Upgrade Required */}
      {user.is_free_trial_active && (user.free_trial_sessions_remaining ?? 0) === 0 && (
        <Card variant="default" padding="lg" className="border-2 border-teal-300 dark:border-teal-600">
          <CardHeader>
            <CardTitle>Free Trial Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    3 of 3 Sessions Used
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a pricing tier to continue using MeetingSync
                  </p>
                </div>
                <Badge variant="neutral">Trial Complete</Badge>
              </div>

              {/* Pricing Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Choose Your Plan:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Starter</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">1 translation (2 total)</span>
                    </div>
                    <span className="font-bold text-teal-600 dark:text-teal-400">$45/hour</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Professional</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">5 translations (6 total)</span>
                    </div>
                    <span className="font-bold text-teal-600 dark:text-teal-400">$75/hour</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Enterprise</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">15 translations (16 total)</span>
                    </div>
                    <span className="font-bold text-teal-600 dark:text-teal-400">$105/hour</span>
                  </div>
                </div>
              </div>

              {/* Upgrade Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="primary" onClick={() => alert('To select a pricing plan:\n\n1. Close this Settings page (click Back button)\n2. You\'ll return to the Start Translation screen\n3. The pricing tier selector will be available there\n\nChoose from:\n• Starter ($45/hr - 1 translation, 2 total languages)\n• Professional ($75/hr - 5 translations, 6 total languages)  \n• Enterprise ($105/hr - 15 translations, 16 total languages)')}>
                  Choose Your Plan
                </Button>
                <Button variant="secondary" onClick={handleAddPaymentMethod}>
                  Add Payment Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PAYG Plan Details */}
      {!user.is_free_trial_active && user.subscription_tier && (
        <Card variant="beautiful" padding="lg">
          <CardHeader>
            <CardTitle>Current PAYG Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {user.subscription_tier === 'starter' ? 'Starter' : user.subscription_tier === 'professional' ? 'Professional' : 'Enterprise'} Tier
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    ${user.subscription_tier === 'starter' ? '45' : user.subscription_tier === 'professional' ? '75' : '105'}/hour • Pay-As-You-Go
                  </p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              {/* Plan Features */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <ul className="space-y-2 text-sm">
                  {PRICING_TIERS[user.subscription_tier].features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-teal-600 dark:text-teal-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Payment Method:</strong> {user.payment_method || 'Not set'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Billing:</strong> Charged per session at completion
                </p>
              </div>

              {/* Plan Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="primary" onClick={() => alert('Change tier feature coming soon!')}>
                  Change Tier
                </Button>
                <Button variant="secondary" onClick={handleManagePaymentMethods}>
                  Update Payment Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PAYG Usage & Billing */}
      {isPAYG && !user.is_free_trial_active && user.payment_method_added && (
        <Card variant="beautiful" padding="lg">
          <CardHeader>
            <CardTitle>Current Billing Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  ${user.unpaid_usage?.toFixed(2) || '0.00'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Unpaid Usage This Month
                </p>
              </div>

              {(user.unpaid_usage || 0) > 150 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    High usage detected. You'll be automatically billed ${user.unpaid_usage?.toFixed(2)} at end of billing period.
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Payment Method:</strong> {user.payment_method || 'Not set'}
                </p>
                {user.billing_period_start && user.billing_period_end && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Billing Period:</strong> {user.billing_period_start} to {user.billing_period_end}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Billing:</strong> Automatic charge at end of month
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={handleManagePaymentMethods}>
                  Update Payment Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice History */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_INVOICES.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No invoices yet
              </p>
            )}

            {MOCK_INVOICES.map(invoice => (
              <Card key={invoice.id} variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatDate(invoice.billing_period_end)}
                      </h4>
                      <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invoice #{invoice.id.split('_')[2]}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {invoice.session_charges.length} session{invoice.session_charges.length > 1 ? 's' : ''} • PAYG billing
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {invoice.session_charges.reduce((sum, charge) => sum + charge.duration_hours, 0).toFixed(1)} hours total
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(invoice.total_amount)}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                        View Details
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => alert('Download PDF feature coming soon!')}>
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Info */}
      <Card variant="default" padding="lg" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            About Billing
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              • Pay-as-you-go: charged only for actual session time used
            </p>
            <p>
              • Billing occurs at session completion with transparent pricing
            </p>
            <p>
              • Switch tiers anytime to access more languages
            </p>
            <p>
              • Free trial available for new users (3 sessions)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
