import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';
import { MOCK_INVOICES } from '../../utils/mockData';
import { formatCurrency, formatDate } from '../../utils/constants';

export interface InvoiceDetailPageProps {
  invoiceId?: string;
  onBack: () => void;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

/**
 * InvoiceDetailPage Component
 *
 * Displays detailed invoice information including line items, totals, and actions.
 * Features:
 * - Invoice metadata (number, date, status)
 * - Line items table with sessions
 * - Subtotal, tax, and total calculations
 * - Download PDF button (mockup)
 * - Email invoice button (mockup)
 * - Payment method and billing address
 */
export function InvoiceDetailPage({ invoiceId, onBack }: InvoiceDetailPageProps) {
  const { toast, showToast } = useToast();

  // Get invoice data (default to first invoice if not specified)
  const invoice = MOCK_INVOICES.find(inv => inv.id === invoiceId) || MOCK_INVOICES[0];

  // Generate line items from V1 PAYG session charges
  const lineItems: InvoiceLineItem[] = invoice.session_charges.map((charge, index) => ({
    id: `line_${index + 1}`,
    description: `Session on ${formatDate(charge.session_date)} - ${charge.tier_used.charAt(0).toUpperCase() + charge.tier_used.slice(1)} tier`,
    hours: charge.duration_hours,
    rate: charge.rate_per_hour,
    amount: charge.charge
  }));

  const subtotal = invoice.total_amount;
  const tax = subtotal * 0.08; // 8% tax (mockup)
  const total = subtotal + tax;

  // Breadcrumbs navigation
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: () => onBack() },
    { label: 'Account', onClick: () => onBack() },
    { label: 'Invoice Detail' }
  ];

  // Action handlers
  const handleDownloadPDF = () => {
    showToast('PDF download started', 'success');
  };

  const handleEmailInvoice = () => {
    showToast('Invoice sent to your email', 'success');
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
              Invoice {invoice.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Billing Period: {formatDate(invoice.billing_period_start)} - {formatDate(invoice.billing_period_end)}
            </p>
          </div>

          <Badge
            variant={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'}
            size="md"
          >
            {invoice.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Invoice Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Invoice Number</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Invoice Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(invoice.billing_period_start)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {invoice.paid_at ? formatDate(invoice.paid_at) : 'Not paid'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Hours
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Rate
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-100">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                        {item.hours.toFixed(1)}
                      </td>
                      <td className="py-4 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="py-4 px-4 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-teal-600 dark:text-teal-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment Method</p>
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Visa ****1234</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Expires 12/2026</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Billing Address</p>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  <p>123 Main St</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleEmailInvoice}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Invoice
          </Button>

          <Button variant="primary" onClick={handleDownloadPDF}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast {...toast} />
    </div>
  );
}
