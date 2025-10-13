import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export interface UploadGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (glossary: {
    name: string;
    file: File;
    termCount: number;
  }) => void;
}

/**
 * UploadGlossaryModal - Upload a custom glossary CSV file
 *
 * Allows users to upload domain-specific terminology for
 * improved translation accuracy.
 */
export function UploadGlossaryModal({ isOpen, onClose, onUpload }: UploadGlossaryModalProps) {
  const [glossaryName, setGlossaryName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [termCount, setTermCount] = useState(0);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setSelectedFile(file);

    // Read and preview CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(line => line.split(','));

      // Filter out empty lines
      const validLines = lines.filter(line => line.some(cell => cell.trim() !== ''));

      setTermCount(validLines.length - 1); // Subtract header row
      setCsvPreview(validLines.slice(0, 6)); // Show first 5 rows + header
    };
    reader.readAsText(file);
  };

  // Handle upload
  const handleUpload = () => {
    if (!glossaryName.trim()) {
      alert('Please enter a glossary name');
      return;
    }

    if (!selectedFile) {
      alert('Please select a CSV file');
      return;
    }

    onUpload({
      name: glossaryName,
      file: selectedFile,
      termCount
    });

    // Reset form
    setGlossaryName('');
    setSelectedFile(null);
    setCsvPreview([]);
    setTermCount(0);
  };

  const handleCancel = () => {
    // Reset form
    setGlossaryName('');
    setSelectedFile(null);
    setCsvPreview([]);
    setTermCount(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Upload Glossary (CSV)"
      size="lg"
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-semibold">
            CSV Format Requirements
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>Two columns: Source Term, Translation</li>
            <li>First row should be headers (e.g., "English, Spanish")</li>
            <li>UTF-8 encoding recommended</li>
            <li>Example: "machine learning, aprendizaje automático"</li>
          </ul>
        </div>

        {/* Glossary Name */}
        <Input
          label="Glossary Name"
          type="text"
          value={glossaryName}
          onChange={(e) => setGlossaryName(e.target.value)}
          placeholder="e.g., Medical Terminology"
          required
        />

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 dark:text-gray-100
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-teal-50 file:text-teal-700
              hover:file:bg-teal-100
              dark:file:bg-teal-900/20 dark:file:text-teal-400
              dark:hover:file:bg-teal-900/30"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectedFile.name} ({termCount} terms)
            </p>
          )}
        </div>

        {/* CSV Preview */}
        {csvPreview.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview (First 5 Rows)
            </label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-48">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {csvPreview[0]?.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {csvPreview.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total terms: {termCount}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="primary" size="lg"
            onClick={handleUpload}
            className="flex-1"
            disabled={!selectedFile || !glossaryName.trim()}
          >
            Upload Glossary
          </Button>
          <Button variant="secondary" size="md"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
