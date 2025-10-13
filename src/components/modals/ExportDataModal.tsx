import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { useToast, Toast } from '../ui/Toast';

export interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportStep = 1 | 2 | 3;
type DataType = 'sessions' | 'transcripts' | 'invoices';
type ExportFormat = 'csv' | 'pdf' | 'excel';

/**
 * ExportDataModal Component
 *
 * Multi-step modal for exporting user data with configuration options.
 * Features:
 * - Step 1: Select data type (Sessions, Transcripts, Invoices)
 * - Step 2: Configure export (date range, format)
 * - Step 3: Confirmation and email delivery option
 * - Progress indicator showing current step
 * - Back/Next/Cancel buttons for navigation
 * - Export button with success feedback
 */
export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const { toast, showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<ExportStep>(1);
  const [isExporting, setIsExporting] = useState(false);

  // Form state
  const [dataType, setDataType] = useState<DataType>('sessions');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [emailDelivery, setEmailDelivery] = useState(false);

  // Progress indicator steps
  const steps = ['Select Data', 'Configure', 'Export'];

  // Reset form when modal opens/closes
  const handleClose = () => {
    setCurrentStep(1);
    setDataType('sessions');
    setDateFrom('');
    setDateTo('');
    setFormat('csv');
    setEmailDelivery(false);
    setIsExporting(false);
    onClose();
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as ExportStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as ExportStep);
    }
  };

  // Export handler
  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsExporting(false);
    showToast(
      emailDelivery
        ? 'Export started. You will receive an email when ready.'
        : 'Export completed successfully!',
      'success'
    );
    handleClose();
  };

  // Validation for next button
  const canProceedToStep2 = Boolean(dataType);
  const canProceedToStep3 = Boolean(dateFrom && dateTo && format);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Export Data
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export your MeetingSync data in your preferred format
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          {/* Step 1: Select Data Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  What would you like to export?
                </h3>
                <div className="space-y-3">
                  {/* Sessions Option */}
                  <label
                    className={`
                      flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        dataType === 'sessions'
                          ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="sessions"
                      checked={dataType === 'sessions'}
                      onChange={(e) => setDataType(e.target.value as DataType)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Session History
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export all meeting sessions with dates, durations, and participants
                      </p>
                    </div>
                  </label>

                  {/* Transcripts Option */}
                  <label
                    className={`
                      flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        dataType === 'transcripts'
                          ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="transcripts"
                      checked={dataType === 'transcripts'}
                      onChange={(e) => setDataType(e.target.value as DataType)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Full Transcripts
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export complete transcripts with all translations and timestamps
                      </p>
                    </div>
                  </label>

                  {/* Invoices Option */}
                  <label
                    className={`
                      flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        dataType === 'invoices'
                          ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value="invoices"
                      checked={dataType === 'invoices'}
                      onChange={(e) => setDataType(e.target.value as DataType)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Billing & Invoices
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export billing history, invoices, and payment records
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configure Export */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Configure your export
                </h3>

                {/* Date Range */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="From Date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                    <Input
                      type="date"
                      label="To Date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </div>

                {/* Format Selection */}
                <div>
                  <Select
                    label="Export Format"
                    options={[
                      { value: 'csv', label: 'CSV (Comma Separated Values)' },
                      { value: 'pdf', label: 'PDF (Portable Document Format)' },
                      { value: 'excel', label: 'Excel Spreadsheet (.xlsx)' }
                    ]}
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Review and export
                </h3>

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Data Type:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {dataType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Date Range:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {dateFrom} to {dateTo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Format:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase">
                      {format}
                    </span>
                  </div>
                </div>

                {/* Email Delivery Option */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Checkbox
                    id="emailDelivery"
                    checked={emailDelivery}
                    onChange={(e) => setEmailDelivery(e.target.checked)}
                  />
                  <label htmlFor="emailDelivery" className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Email me when ready
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Large exports may take several minutes. We'll send you a download link via
                      email when your export is ready.
                    </p>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              {currentStep < 3 ? (
                <Button variant="primary" size="lg"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedToStep2) ||
                    (currentStep === 2 && !canProceedToStep3)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button variant="primary" size="lg"
                  onClick={handleExport}
                  isLoading={isExporting}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast notifications */}
      <Toast {...toast} />
    </>
  );
}
