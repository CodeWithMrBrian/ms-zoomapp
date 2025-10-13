import React, { useState } from 'react';
import { Language } from '../../../types';
import { LANGUAGES } from '../../../utils/constants';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';

interface RequestLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguages: Language[];
  onRequestLanguage: (language: Language) => void;
  isPending?: boolean;
}

/**
 * Modal for participants to request additional languages beyond tier limits
 * Appears when participant tries to select a language not pre-approved by host
 */
const RequestLanguageModal: React.FC<RequestLanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguages,
  onRequestLanguage,
  isPending = false
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [requestReason, setRequestReason] = useState('');

  // Get available languages not already in session
  const availableLanguages = LANGUAGES.filter(
    (lang: Language) => !currentLanguages.some(current => current.code === lang.code)
  );

  // Get language name (ensure clean display without language codes)
  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find(l => l.code === code);
    if (!language) return 'Unknown Language';
    
    let name = language.name;
    if (name.includes(' ')) {
      const parts = name.split(' ');
      if (parts[0].length === 2 && parts[0].toUpperCase() === parts[0] && /^[A-Z]{2}$/.test(parts[0])) {
        name = parts.slice(1).join(' ');
      }
    }
    return name;
  };

  const handleSubmitRequest = () => {
    if (selectedLanguage) {
      onRequestLanguage(selectedLanguage);
      setSelectedLanguage(null);
      setRequestReason('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedLanguage(null);
    setRequestReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌐</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Request Additional Language
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait for the host to review and approve your request
            </p>
          </div>
        </div>

        {/* Current Languages Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currently Available Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentLanguages.map((lang) => (
              <span
                key={lang.code}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              >
                {getLanguageName(lang.code)}
              </span>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Language to Request
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800">
            {availableLanguages.map((language: Language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language)}
                className={`flex items-center gap-2 p-2 text-left rounded-md transition-colors ${
                  selectedLanguage?.code === language.code
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <span className="text-sm">{getLanguageName(language.code)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Reason (for better host context) */}
        <div className="mb-6">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for Request (Optional)
          </label>
          <textarea
            id="reason"
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            placeholder="Help the host understand why this language is needed..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {requestReason.length}/200 characters
          </p>
        </div>

        {/* Request Process Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-blue-500 mt-0.5 mr-3 text-lg">💬</span>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Request Process
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your request will be sent to the host for approval. This may take a few moments as they review your request.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Status */}
        {isPending && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 mb-6">
            <div className="flex items-start">
              <span className="text-green-500 mt-0.5 mr-3 text-lg">⏰</span>
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Request Sent
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your language request has been sent to the host. Please wait for their approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleSubmitRequest}
            disabled={!selectedLanguage || isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? 'Requesting...' : 'Send Request'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestLanguageModal;