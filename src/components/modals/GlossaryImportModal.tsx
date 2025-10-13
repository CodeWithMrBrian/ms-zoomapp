import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { useToast, Toast } from '../ui/Toast';
import { Badge } from '../ui/Badge';

export interface GlossaryImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  glossaryId: string;
}

// Mock preview data
const PREVIEW_ROWS = [
  { source: 'MRI', target: 'Resonancia Magnética', notes: 'Medical imaging' },
  { source: 'CT Scan', target: 'Tomografía Computarizada', notes: 'Computed tomography' },
  { source: 'Diagnosis', target: 'Diagnóstico', notes: 'Medical determination' },
  { source: 'Prescription', target: 'Receta', notes: 'Written medication order' },
  { source: 'Anesthesia', target: 'Anesthésie', notes: 'Loss of sensation' }
];

/**
 * GlossaryImportModal Component
 *
 * 3-step modal flow for importing glossary terms from CSV/Excel.
 */
export function GlossaryImportModal({ isOpen, onClose, glossaryId }: GlossaryImportModalProps) {
  const { toast, showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [sourceColumn, setSourceColumn] = useState('Column A');
  const [targetColumn, setTargetColumn] = useState('Column B');
  const [notesColumn, setNotesColumn] = useState('Column C');
  const [isImporting, setIsImporting] = useState(false);

  const steps = ['Upload File', 'Map Columns', 'Import Confirmation'];

  // Mock stats
  const termsToImport = 245;
  const duplicatesFound = 12;

  const handleFileSelect = () => {
    // Simulate file selection
    setFileName('medical_terms.csv');
    showToast('File uploaded successfully', 'success');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fileName) {
        showToast('Please upload a file', 'warning');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImport = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      showToast(`${termsToImport - duplicatesFound} terms imported successfully`, 'success');
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFileName('');
    setSourceColumn('Column A');
    setTargetColumn('Column B');
    setNotesColumn('Column C');
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Import Glossary Terms
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Import terms from CSV or Excel file
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Upload File */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Upload a CSV or Excel file containing your glossary terms.
                </p>

                {/* File Upload Dropzone */}
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-teal-500 dark:hover:border-teal-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800"
                  onClick={handleFileSelect}
                >
                  {fileName ? (
                    <div className="space-y-3">
                      <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click to change file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          CSV or Excel file (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sample File Link */}
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    Need help?{' '}
                    <button className="text-teal-600 dark:text-teal-400 hover:underline">
                      Download sample file
                    </button>
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Map Columns */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Map your file columns to glossary fields:
                </p>

                <div className="space-y-4">
                  <Select
                    label="Source Term Column"
                    options={[
                      { value: 'Column A', label: 'Column A' },
                      { value: 'Column B', label: 'Column B' },
                      { value: 'Column C', label: 'Column C' },
                      { value: 'Column D', label: 'Column D' }
                    ]}
                    value={sourceColumn}
                    onChange={(e) => setSourceColumn(e.target.value)}
                  />

                  <Select
                    label="Target Translation Column"
                    options={[
                      { value: 'Column A', label: 'Column A' },
                      { value: 'Column B', label: 'Column B' },
                      { value: 'Column C', label: 'Column C' },
                      { value: 'Column D', label: 'Column D' }
                    ]}
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                  />

                  <Select
                    label="Notes Column (Optional)"
                    options={[
                      { value: '', label: 'None' },
                      { value: 'Column A', label: 'Column A' },
                      { value: 'Column B', label: 'Column B' },
                      { value: 'Column C', label: 'Column C' },
                      { value: 'Column D', label: 'Column D' }
                    ]}
                    value={notesColumn}
                    onChange={(e) => setNotesColumn(e.target.value)}
                  />
                </div>

                {/* Preview */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Preview (First 5 rows)
                  </h4>
                  <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Source Term
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Translation
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {PREVIEW_ROWS.map((row, index) => (
                          <tr key={index} className="border-t border-gray-100 dark:border-gray-800">
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {row.source}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                              {row.target}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              {row.notes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Import Confirmation */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <svg className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Ready to Import
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Review the import summary before proceeding.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">File:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {fileName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Terms to import:</span>
                    <Badge variant="success" size="md">
                      {termsToImport} terms
                    </Badge>
                  </div>
                  {duplicatesFound > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Duplicates found:</span>
                      <Badge variant="warning" size="md">
                        {duplicatesFound} duplicates (will be skipped)
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      New terms to add:
                    </span>
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {termsToImport - duplicatesFound}
                    </span>
                  </div>
                </div>

                {duplicatesFound > 0 && (
                  <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-left">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-yellow-900 dark:text-yellow-100">
                      {duplicatesFound} terms already exist in this glossary and will be skipped.
                    </p>
                  </div>
                )}
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
                >
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === 1 ? 'Continue' : 'Review Import'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleImport} isLoading={isImporting}>
                  {isImporting ? 'Importing...' : 'Import Terms'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>

      <Toast {...toast} />
    </>
  );
}
