import { useState, useMemo, useRef, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { NavigationHeader } from '../../ui/NavigationHeader';
import { useSession } from '../../../context/SessionContext';
import { LANGUAGES } from '../../../utils/constants';
import { pricingConfig } from '../../../utils/pricingManager';
import RequestLanguageModal from './RequestLanguageModal';
import { Language } from '../../../types';

interface ParticipantLanguageSelectProps {
  onLanguageSelect: (languageCode: string) => void;
  onCancel?: () => void;
  onRequestLanguage?: (language: Language) => void;
}

export function ParticipantLanguageSelect({ onLanguageSelect, onCancel, onRequestLanguage }: ParticipantLanguageSelectProps) {
  const { session, addLanguageToSession } = useSession();
  const { isDailyFreeTier } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedLanguages, setRequestedLanguages] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Ref for the Free Tier disabled button
  const freeTierDisabledBtnRef = useRef<HTMLButtonElement | null>(null);

  // Check if host has enabled language requests
  const isLanguageRequestsEnabled = session?.allow_language_requests === true;

  // Get available languages from active session
  const availableLanguages = useMemo(() => {
    if (!session) return [];
    let maxLanguages = session.target_languages.length;
    if (isDailyFreeTier) {
      maxLanguages = pricingConfig.getFreeTierLanguageLimits().total;
    } else if (session.tier) {
      // session.tier should be 'starter', 'professional', or 'enterprise'
      maxLanguages = pricingConfig.getPaygTierLanguageLimits(session.tier).total;
    }
    const filtered = LANGUAGES.filter(lang => session.target_languages.includes(lang.code));
    return filtered.slice(0, maxLanguages);
  }, [session, isDailyFreeTier]);

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return availableLanguages;
    return availableLanguages.filter(lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableLanguages, searchQuery]);

  // Focus the Free Tier disabled button when all languages are selected (Free Tier only)
  useEffect(() => {
    if (
      isDailyFreeTier &&
      availableLanguages.length > 0 &&
      selectedLanguage === null &&
      filteredLanguages.length === 0 &&
      freeTierDisabledBtnRef.current
    ) {
      freeTierDisabledBtnRef.current.focus();
    }
  }, [isDailyFreeTier, availableLanguages.length, selectedLanguage, filteredLanguages.length]);

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

  // Handle request for custom/search language
  const handleRequestCustomLanguage = () => {
    if (isLanguageRequestsEnabled) {
      setShowRequestModal(true);
    }
  };

  // Handle refresh languages (simulate host auto-approval)
  const handleRefreshLanguages = () => {
    if (!isLanguageRequestsEnabled) {
      return; // Don't allow any action if language requests are disabled
    }
    
    if (requestedLanguages.length > 0) {
      const approvedLanguages = [...requestedLanguages];
      
      // Simulate host auto-approval by adding all requested languages to session
      requestedLanguages.forEach(languageCode => {
        addLanguageToSession(languageCode);
      });
      
      // Clear the requested languages list and show success
      setRequestedLanguages([]);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      console.log('[ParticipantLanguageSelect] Auto-approved and added languages:', approvedLanguages);
    } else {
      // If no requested languages, show the request modal
      setShowRequestModal(true);
    }
  };

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
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card variant="default" padding="lg" className="max-w-md w-full">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader 
        title="Select Your Language"
        onBack={onCancel}
        backLabel="Leave Session"
        showBackButton={!!onCancel}
      />
      
      <div className="max-w-md mx-auto p-6 pt-20">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 text-center">
              ✅ New languages approved and added to the session!
            </p>
          </div>
        )}

        {/* Pending Requests Info */}
        {requestedLanguages.length > 0 && !showSuccessMessage && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              📝 {requestedLanguages.length} language{requestedLanguages.length !== 1 ? 's' : ''} requested and approved! Click refresh to access.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Language Selection Grid */}
        <div className="space-y-3 mb-6">
          {filteredLanguages.map((language) => {
            const label = getLanguageName(language.code);
            console.log('[ParticipantLanguageSelect] Rendered label:', label);
            return (
            <Card
              key={language.code}
              variant={selectedLanguage === language.code ? "selected" : "default"}
              padding="md"
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSelectLanguage(language.code)}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </p>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>

        {/* No Results Message */}
        {filteredLanguages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No languages found matching "{searchQuery}"
            </p>
            {!isDailyFreeTier && isLanguageRequestsEnabled && (
              <Button 
                variant="outline" 
                onClick={handleRequestCustomLanguage}
                className="mb-2"
              >
                Request "{searchQuery}" Language
              </Button>
            )}
            {!isDailyFreeTier && !isLanguageRequestsEnabled && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Host has disabled additional language requests.</p>
            )}
            {isDailyFreeTier && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Free tier users cannot request additional languages.</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 mt-6">
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedLanguage}
            className="w-full"
          >
            {selectedLanguage 
              ? `Confirm ${getLanguageName(selectedLanguage)}` 
              : 'Select a Language'
            }
          </Button>
          
          {!isDailyFreeTier && isLanguageRequestsEnabled && (
            <Button
              variant="outline"
              onClick={handleRefreshLanguages}
              className="w-full"
            >
              {requestedLanguages.length > 0 
                ? `🔄 Refresh Languages (${requestedLanguages.length} approved)`
                : '+ Request Different Language'
              }
            </Button>
          )}
          {!isDailyFreeTier && !isLanguageRequestsEnabled && (
            <Button
              variant="outline"
              className="w-full opacity-50 cursor-not-allowed"
              disabled
            >
              + Request Different Language (Host disabled)
            </Button>
          )}
          {isDailyFreeTier && (
            <Button
              variant="outline"
              className="w-full opacity-50 cursor-not-allowed"
              disabled
              ref={freeTierDisabledBtnRef}
            >
              + Request Different Language (Free tier disabled)
            </Button>
          )}
        </div>
      </div>

      {/* Request Language Modal */}
      {showRequestModal && !isDailyFreeTier && isLanguageRequestsEnabled && (
        <RequestLanguageModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onRequestLanguage={(language: Language) => {
            // Track the requested language for mock auto-approval
            setRequestedLanguages(prev => [...prev, language.code]);
            
            if (onRequestLanguage) {
              onRequestLanguage(language);
            }
            setShowRequestModal(false);
          }}
          currentLanguages={session?.target_languages?.map(code => 
            LANGUAGES.find(lang => lang.code === code)
          ).filter(Boolean) as Language[] || []}
        />
      )}
    </div>
  );
}
