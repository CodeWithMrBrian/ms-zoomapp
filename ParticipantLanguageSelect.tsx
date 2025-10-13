import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useSession } from '../../../context/SessionContext';
import { LANGUAGES } from '../../../utils/constants';

/**
 * ParticipantLanguageSelect Screen (Screen 6)
 *
 * Participant selects their preferred translation language.
 *
 * Features:
 * - Large language cards with flags
 * - Search/filter languages
 * - Shows only languages active in current session
 * - Visual feedback on selection
 */

interface ParticipantLanguageSelectProps {
  onLanguageSelect: (languageCode: string) => void;
  onCancel?: () => void;
}

export function ParticipantLanguageSelect({ onLanguageSelect, onCancel }: ParticipantLanguageSelectProps) {
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Get available languages from active session
  const availableLanguages = useMemo(() => {
    if (!session) return [];

    return LANGUAGES.filter(lang =>
      session.target_languages.includes(lang.code)
    );
  }, [session]);

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return availableLanguages;

    return availableLanguages.filter(lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableLanguages, searchQuery]);

  // Handle language selection
  const handleSelectLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  // Get language name (ensure clean display without language codes)
  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find((l: any) => l.code === code);
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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card variant="default" padding="lg">
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                No Active Session
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait for the host to start a translation session.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-lg px-6 py-4 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white text-center">
          Select Your Language
        </h1>
        <p className="text-teal-100 dark:text-teal-200 text-center mt-2">
          Choose the language you want to receive translations in
        </p>
      </div>

      {/* Session Info */}
      <Card variant="default" padding="md" className="mb-6">
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Session: <strong className="text-gray-900 dark:text-gray-100">{session.meeting_title}</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Host: {session.host_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Source Language: <strong className="text-gray-900 dark:text-gray-100">{getLanguageName(session.source_language)}</strong>
          </p>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Language Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredLanguages.length === 0 && (
          <div className="col-span-2">
            <Card variant="default" padding="lg">
              <CardContent>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  No languages found matching "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredLanguages.map((lang: any) => (
          <Card
            key={lang.code}
            variant={selectedLanguage === lang.code ? 'selected' : 'hover'}
            padding="lg"
            onClick={() => handleSelectLanguage(lang.code)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Flag */}
              <div className="text-5xl">{lang.flag}</div>

              {/* Language Info */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {getLanguageName(lang.code)}
                </h3>
              </div>

              {/* Selection Indicator */}
              {selectedLanguage === lang.code && (
                <div className="text-3xl text-teal-600 dark:text-teal-400">
                  ✓
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Confirm Button */}
      {selectedLanguage && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            className="w-full max-w-md text-lg py-4 shadow-xl"
          >
            Continue with {getLanguageName(selectedLanguage)}
          </Button>
        </div>
      )}

      {/* Help Text */}
      <Card variant="default" padding="md" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 mt-6">
        <CardContent>
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            You can change your language selection at any time during the session
          </p>
        </CardContent>
      </Card>

      {/* Cancel Button */}
      {onCancel && (
        <div className="text-center mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
