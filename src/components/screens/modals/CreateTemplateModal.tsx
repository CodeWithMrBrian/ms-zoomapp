import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Checkbox } from '../../ui/Checkbox';
import { LANGUAGES, MEETING_TYPES } from '../../../utils/constants';
import { MOCK_GLOSSARIES } from '../../../utils/mockData';
import { MeetingType } from '../../../types';

export interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: {
    name: string;
    meeting_type: MeetingType;
    source_language: string;
    target_languages: string[];
    glossary_id: string | null;
    host_instructions: string;
  }) => void;
}

/**
 * CreateTemplateModal - Create a new session template
 *
 * Allows users to save frequently-used session configurations
 * for quick reuse in future meetings.
 */
export function CreateTemplateModal({ isOpen, onClose, onSave }: CreateTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType>('general');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [selectedGlossary, setSelectedGlossary] = useState<string | null>(null);
  const [hostInstructions, setHostInstructions] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Filter languages based on search
  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.native_name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Toggle language selection
  const toggleLanguage = (langCode: string) => {
    setTargetLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  // Handle save
  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (targetLanguages.length === 0) {
      alert('Please select at least one target language');
      return;
    }

    onSave({
      name: templateName,
      meeting_type: meetingType,
      source_language: sourceLanguage,
      target_languages: targetLanguages,
      glossary_id: selectedGlossary,
      host_instructions: hostInstructions
    });

    // Reset form
    setTemplateName('');
    setMeetingType('general');
    setSourceLanguage('en');
    setTargetLanguages([]);
    setSelectedGlossary(null);
    setHostInstructions('');
    setLanguageSearch('');
  };

  const handleCancel = () => {
    // Reset form
    setTemplateName('');
    setMeetingType('general');
    setSourceLanguage('en');
    setTargetLanguages([]);
    setSelectedGlossary(null);
    setHostInstructions('');
    setLanguageSearch('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create New Template"
      size="lg"
    >
      <div className="space-y-6">
        {/* Template Name */}
        <Input
          label="Template Name"
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="e.g., Weekly Team Meeting"
          required
        />

        {/* Meeting Type */}
        <Select
          label="Meeting Type"
          value={meetingType}
          onChange={(e) => setMeetingType(e.target.value as MeetingType)}
          options={MEETING_TYPES.map(type => ({
            value: type.value,
            label: type.label
          }))}
        />

        {/* Source Language */}
        <Select
          label="Source Language"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          options={LANGUAGES.map(lang => ({
            value: lang.code,
            label: `${lang.flag} ${lang.name} (${lang.native_name})`
          }))}
        />

        {/* Target Languages */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Languages
          </label>

          {/* Tier Language Adjustment Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Language selection may need adjustments depending on your active tier. 
                  Starter tier allows up to 3 languages, Professional up to 8 languages, and Enterprise unlimited languages.
                </p>
              </div>
            </div>
          </div>

          {/* Language Search */}
          <Input
            type="text"
            placeholder="Search languages..."
            value={languageSearch}
            onChange={(e) => setLanguageSearch(e.target.value)}
          />

          {/* Language Grid */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {filteredLanguages.slice(0, 20).map(lang => (
                <Checkbox
                  key={lang.code}
                  label={`${lang.flag} ${lang.name}`}
                  checked={targetLanguages.includes(lang.code)}
                  onChange={() => toggleLanguage(lang.code)}
                />
              ))}
            </div>
          </div>

          {/* Selected Count */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected: {targetLanguages.length} language{targetLanguages.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Glossary */}
        <Select
          label="Glossary (Optional)"
          value={selectedGlossary || ''}
          onChange={(e) => setSelectedGlossary(e.target.value || null)}
          options={[
            { value: '', label: 'None' },
            ...MOCK_GLOSSARIES.map(g => ({
              value: g.id,
              label: `${g.name} (${g.term_count} terms)`
            }))
          ]}
        />

        {/* Host Instructions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Host Instructions (Optional, 500 char limit)
          </label>
          <textarea
            value={hostInstructions}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setHostInstructions(e.target.value);
              }
            }}
            placeholder="Instructions for participants..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {hostInstructions.length}/500 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="primary" size="lg"
            onClick={handleSave}
            className="flex-1"
          >
            Save Template
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
