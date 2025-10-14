import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { useToast, Toast } from '../ui/Toast';

export interface GlossaryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  glossaryId: string;
  glossaryName: string;
}

/**
 * GlossaryExportModal Component
 *
 * Simple modal for exporting glossary terms with format options.
 */
export function GlossaryExportModal({ isOpen, onClose, glossaryId: _glossaryId, glossaryName }: GlossaryExportModalProps) {
  const { toast, showToast } = useToast();
  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [fileName, setFileName] = useState(glossaryName.toLowerCase().replace(/\s+/g, '_'));
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      showToast(`Glossary exported as ${format.toUpperCase()}`, 'success');
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setFormat('csv');
    setIncludeMetadata(true);
    setIncludeNotes(true);
    setFileName(glossaryName.toLowerCase().replace(/\s+/g, '_'));
    onClose();
  };

  const getFileExtension = () => {
    switch (format) {
      case 'csv':
        return '.csv';
      case 'excel':
        return '.xlsx';
      case 'json':
        return '.json';
      default:
        return '.csv';
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Export Glossary
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Export "{glossaryName}" to a file
            </p>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Format
            </label>

            <label
              className={`
                flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${format === 'csv'
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                }
              `}
            >
              <input
                type="radio"
                name="format"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as 'csv')}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">CSV</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comma-separated values, compatible with Excel and Google Sheets
                </p>
              </div>
            </label>

            <label
              className={`
                flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${format === 'excel'
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                }
              `}
            >
              <input
                type="radio"
                name="format"
                value="excel"
                checked={format === 'excel'}
                onChange={(e) => setFormat(e.target.value as 'excel')}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">Excel</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Native Microsoft Excel format with formatting
                </p>
              </div>
            </label>

            <label
              className={`
                flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${format === 'json'
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                }
              `}
            >
              <input
                type="radio"
                name="format"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value as 'json')}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">JSON</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Structured data format for developers and APIs
                </p>
              </div>
            </label>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Options
            </label>

            <Checkbox
              id="include-metadata"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
              label="Include metadata"
              description="Language codes, tags, and creation dates"
            />

            <Checkbox
              id="include-notes"
              checked={includeNotes}
              onChange={(e) => setIncludeNotes(e.target.checked)}
              label="Include notes"
              description="Additional notes and context for each term"
            />
          </div>

          {/* File Name */}
          <div>
            <Input
              label="File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Will be saved as: {fileName}{getFileExtension()}
            </p>
          </div>

          {/* Info Notice */}
          <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              The file will be downloaded to your default downloads folder.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} isLoading={isExporting}>
              {isExporting ? 'Exporting...' : 'Export Glossary'}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast {...toast} />
    </>
  );
}
