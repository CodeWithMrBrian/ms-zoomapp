import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Select } from '../../ui/Select';
import { Checkbox } from '../../ui/Checkbox';
import { Toggle } from '../../ui/Toggle';

import { Input } from '../../ui/Input';
import { NavigationHeader, NavigationAction } from '../../ui/NavigationHeader';
import { HelpIcon } from '../../ui/Tooltip';
import { useToast } from '../../ui/Toast';
import { Skeleton } from '../../ui/Skeleton';
import { useUser } from '../../../context/UserContext';
import { useSession } from '../../../context/SessionContext';
import { useZoom } from '../../../context/ZoomContext';
import { LANGUAGES, MEETING_TYPES, GLOSSARIES_BY_TYPE, calculateParticipantMultiplier } from '../../../utils/constants';
import { pricingConfig } from '../../../utils/pricingManager';
import { MOCK_TEMPLATES, MOCK_GLOSSARIES } from '../../../utils/mockData';
import { MeetingType, SubscriptionTier } from '../../../types';
import { TierConfirmationModal } from '../modals/TierConfirmationModal';
import { canChangeTier } from '../../../utils/tierLockUtils';
import { CreateTemplateModal } from '../modals/CreateTemplateModal';
import { UploadGlossaryModal } from '../modals/UploadGlossaryModal';

/**
 * HostSetup Screen (Screens 1A & 1B)
 *
 * Two versions based on billing type:
 * - Version A: PAYG users - shows tier selector
 * - Version B: Subscription users - shows subscription info, hides tier selector
 *
 * Features:
 * - Template loading (quick start)
 * - Meeting type selector with glossary suggestions
 * - Language selection (source + multiple targets)
 * - Tier selection (PAYG only)
 * - Advanced options (TTS, confidence, glossary, instructions)
 * - Usage tracking display
 */

interface HostSetupProps {
  onStart: () => void;
  onCancel: () => void;
  onSettings: () => void;
  onOpenTierModal: () => void;
}

export function HostSetup({ onStart, onCancel, onSettings, onOpenTierModal }: HostSetupProps) {
  const { user, isPAYG, isHighUsage, isDailyFreeTier, dailyMinutesRemaining, setSubscriptionTier } = useUser();
  const { startSession, isActive } = useSession();
  const { meetingContext } = useZoom();
  const { showToast } = useToast();

  // Configuration state
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none');
  const [meetingType, setMeetingType] = useState<MeetingType>('general');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(user?.subscription_tier || null);
  const [sourceLanguage, setSourceLanguage] = useState<string>('en');
  // All users start with 0 languages selected to avoid pre-selecting invalid tier languages
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [languageSearch, setLanguageSearch] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Ref for Advanced Options button
  const advancedOptionsButtonRef = useRef<HTMLButtonElement>(null);

  // Advanced options state
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [showPartialResults, setShowPartialResults] = useState(true);
  const [selectedGlossary, setSelectedGlossary] = useState<string | null>(null);
  const [hostInstructions, setHostInstructions] = useState<string>('');

  // Modal states
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showUploadGlossaryModal, setShowUploadGlossaryModal] = useState(false);
  const [showTierConfirmation, setShowTierConfirmation] = useState(false);
  const [pendingTierSelection, setPendingTierSelection] = useState<string | null>(null);

  // Track if we're waiting for session to start
  const [isStarting, setIsStarting] = useState(false);

  // Track language loading state (simulated for skeleton display)
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);



  // NEW: Overage permission settings
  const [allowLanguageRequests, setAllowLanguageRequests] = useState(true);
  const [allowParticipantOverage, setAllowParticipantOverage] = useState(false);

  // Simulate language loading (in production, this would be an API call)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingLanguages(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Suggested glossary based on meeting type
  const suggestedGlossary = useMemo(() => {
    if (meetingType === 'general' || meetingType === 'custom') return null;

    const glossaryId = GLOSSARIES_BY_TYPE[meetingType];
    return MOCK_GLOSSARIES.find(g => g.id === glossaryId) || null;
  }, [meetingType]);

  // Language limit based on tier (MOVED BEFORE filteredLanguages to avoid initialization error)
  // FIX #1 (CRITICAL): Use translation_limit (target languages only), NOT total_language_limit
  const languageLimit = useMemo(() => {
    // Daily free tier users limited to configured number of translations
    if (isDailyFreeTier) {
      return pricingConfig.getFreeTierLanguageLimits().translations;
    }

    // Use locked tier if already set, otherwise use local selected tier
    const effectiveTier = user?.subscription_tier || selectedTier;
    
    // If no tier is selected yet, return unlimited to allow selection
    if (!effectiveTier) {
      return Infinity; // Allow unlimited selection until tier is chosen
    }
    
    const tierLimits = pricingConfig.getPaygTierLanguageLimits(effectiveTier);
    return tierLimits.translations; // Starter: 1, Professional: 5, Enterprise: 15
  }, [isDailyFreeTier, selectedTier, user]);

  // Filter languages based ONLY on search text
  // IMPORTANT: Show ALL languages in the list, but limit HOW MANY can be selected via languageLimit
  const filteredLanguages = useMemo(() => {
    console.log('[HostSetup] Showing ALL languages - filtering by search text only');
    console.log('  - Total LANGUAGES available:', LANGUAGES.length);
    console.log('  - User can SELECT up to:', languageLimit, 'languages');

    // Only filter by search text - show ALL languages regardless of tier
    const langs = LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      lang.native_name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      lang.code.toLowerCase().includes(languageSearch.toLowerCase())
    );

    console.log('  - Languages after search filter:', langs.length);

    return langs;
  }, [languageSearch, languageLimit]);

  // Load template when selected
  useEffect(() => {
    if (selectedTemplate === 'none') return;

    // Check if user wants to create new template
    if (selectedTemplate === 'create-new') {
      setShowCreateTemplateModal(true);
      setSelectedTemplate('none'); // Reset dropdown
      return;
    }

    const template = MOCK_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    setMeetingType(template.meeting_type);
    setSourceLanguage(template.source_language);
    setTargetLanguages(template.target_languages);
    if (template.glossary_id) {
      setSelectedGlossary(template.glossary_id);
    }
    if (template.host_instructions) {
      setHostInstructions(template.host_instructions);
    }

    console.log('[HostSetup] Loaded template:', template.name);
  }, [selectedTemplate]);

  // Auto-suggest glossary when meeting type changes
  useEffect(() => {
    if (suggestedGlossary && !selectedGlossary) {
      // Don't auto-select, just show suggestion
      console.log('[HostSetup] Suggested glossary:', suggestedGlossary.name);
    }
  }, [suggestedGlossary, selectedGlossary]);

  // Check if user wants to upload glossary
  useEffect(() => {
    if (selectedGlossary === 'upload-new') {
      setShowUploadGlossaryModal(true);
      setSelectedGlossary(null); // Reset dropdown
    }
  }, [selectedGlossary]);

  // Navigate to active screen when session becomes active
  useEffect(() => {
    console.log('[HostSetup] useEffect triggered - isStarting:', isStarting, 'isActive:', isActive);
    if (isStarting && isActive) {
      console.log('[HostSetup] ✅ Session active! Navigating to host-active screen...');
      setIsStarting(false);
      onStart();
    }
  }, [isStarting, isActive, onStart]);

  // Clear target languages when tier selection changes for PAYG users
  useEffect(() => {
    if (isPAYG && !isDailyFreeTier) {
      const effectiveTier = user?.subscription_tier || selectedTier;
      if (effectiveTier && targetLanguages.length > 0) {
        // Check if current selection exceeds new tier's limit
        const tierLimits = pricingConfig.getPaygTierLanguageLimits(effectiveTier);
        if (targetLanguages.length > tierLimits.translations) {
          console.log('[HostSetup] Tier changed - clearing target languages to enforce new limit');
          setTargetLanguages([]);
          showToast(
            `Target languages cleared. Your ${effectiveTier} tier allows up to ${tierLimits.translations} language${tierLimits.translations !== 1 ? 's' : ''}.`,
            'info'
          );
        }
      }
    }
  }, [selectedTier, user?.subscription_tier, isPAYG, isDailyFreeTier]);

  // Determine if language selection should be disabled
  const isLanguageSelectionDisabled = isPAYG && !isDailyFreeTier && !selectedTier && !user?.subscription_tier;

  // Determine language selection requirements
  const effectiveTier = user?.subscription_tier || selectedTier;
  const requiredLanguageCount = effectiveTier && !isDailyFreeTier ? 
    pricingConfig.getPaygTierLanguageLimits(effectiveTier).translations : 
    (isDailyFreeTier ? pricingConfig.getFreeTierLanguageLimits().translations : null);
  
  const hasCorrectLanguageCount = requiredLanguageCount ? targetLanguages.length === requiredLanguageCount : targetLanguages.length > 0;
  const needsMoreLanguages = requiredLanguageCount && targetLanguages.length < requiredLanguageCount;
  const hasTooManyLanguages = requiredLanguageCount && targetLanguages.length > requiredLanguageCount;

  // Handle tier selection with confirmation
  const handleTierSelection = (tier: string) => {
    // Check if tier change is allowed
    if (!canChangeTier(user?.tier_selected_date)) {
      showToast('You cannot change your tier until the 1st of next month.', 'warning');
      return;
    }

    // Show confirmation popup before selecting tier
    setPendingTierSelection(tier);
    setShowTierConfirmation(true);
  };

  const handleConfirmTierSelection = () => {
    if (pendingTierSelection) {
      setSelectedTier(pendingTierSelection as SubscriptionTier);
      
      // Clear target languages if new tier has fewer language slots
      const newLimit = pricingConfig.getPaygTierLanguageLimits(pendingTierSelection).translations;
      if (targetLanguages.length > newLimit) {
        setTargetLanguages([]);
        showToast(`Languages cleared. Your ${pendingTierSelection} tier allows ${newLimit} language${newLimit !== 1 ? 's' : ''}.`, 'error');
      }
      
      // Show success message
      const tierData = pricingConfig.getPaygTier(pendingTierSelection);
      showToast(`${tierData?.name || pendingTierSelection} tier selected! Select ${newLimit} target language${newLimit !== 1 ? 's' : ''} to continue.`, 'success');
    }
    
    setShowTierConfirmation(false);
    setPendingTierSelection(null);
  };

  const handleCancelTierSelection = () => {
    setShowTierConfirmation(false);
    setPendingTierSelection(null);
  };

  // Handle target language toggle
  const toggleLanguage = (langCode: string) => {
    // Prevent language selection if tier is not selected
    if (isLanguageSelectionDisabled) {
      showToast('Please select a tier above before choosing target languages', 'warning');
      return;
    }

    setTargetLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        // Check language limit
        if (prev.length >= languageLimit) {
          showToast(
        `Language limit reached: ${languageLimit} language${languageLimit !== 1 ? 's' : ''}`,
        'warning'
      );
          return prev;
        }
        return [...prev, langCode];
      }
    });
  };

  // Handle start session
  const handleStart = async () => {
    console.log('[HostSetup] handleStart called');
    console.log('[HostSetup] targetLanguages:', targetLanguages);
    console.log('[HostSetup] sourceLanguage:', sourceLanguage);
    console.log('[HostSetup] meetingType:', meetingType);

    // Check if daily free tier has no minutes remaining
    if (isDailyFreeTier && dailyMinutesRemaining === 0) {
      console.log('[HostSetup] ❌ Daily free tier exhausted - blocking session start');
      showToast(
        'No free minutes remaining. Upgrade to PAYG for unlimited usage starting at $45/hour, or come back tomorrow.',
        'warning'
      );
      return;
    }

    if (!hasCorrectLanguageCount) {
      console.log('[HostSetup] ❌ Incorrect number of target languages selected');
      if (needsMoreLanguages && requiredLanguageCount) {
        showToast(
          `Please select exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for your ${effectiveTier} tier. You need ${requiredLanguageCount - targetLanguages.length} more.`,
          'error'
        );
      } else if (hasTooManyLanguages && requiredLanguageCount) {
        showToast(
          `Please select exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for your ${effectiveTier} tier. Please remove ${targetLanguages.length - requiredLanguageCount} language${targetLanguages.length - requiredLanguageCount !== 1 ? 's' : ''}.`,
          'error'
        );
      } else {
        showToast(
          'Please select target languages to start translation',
          'error'
        );
      }
      // Scroll to target languages section
      document.getElementById('target-languages-label')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    // NEW: If PAYG user hasn't set tier yet, set it now (first session of billing period)
    if (isPAYG && !isDailyFreeTier && !user?.subscription_tier && selectedTier) {
      console.log('[HostSetup] 📌 Setting tier for first session of billing period:', selectedTier);
      setSubscriptionTier(selectedTier);

      // Show confirmation
      const tierNames = { starter: 'Starter', professional: 'Professional', enterprise: 'Enterprise' };
      const tierRates = { starter: 45, professional: 75, enterprise: 95 };
      alert(
        `Tier Locked for This Month\n\n` +
        `${tierNames[selectedTier]} tier ($${tierRates[selectedTier]}/hour) will apply to all your sessions this billing period.\n\n` +
        `You can change your tier next month if needed.`
      );
    }

    console.log('[HostSetup] ✅ Validation passed, setting isStarting=true and calling startSession...');
    setIsStarting(true);

    await startSession({
      source_language: sourceLanguage,
      target_languages: targetLanguages,
      meeting_type: meetingType,
      glossary_id: selectedGlossary || undefined,
      meeting_title: meetingContext?.meetingTopic,
      allow_language_requests: allowLanguageRequests,
      allow_participant_overage: allowParticipantOverage
    });

    console.log('[HostSetup] startSession completed, waiting for isActive to become true...');
    // Navigation will happen automatically in useEffect when isActive becomes true
  };

  // Use suggested glossary
  const useSuggestedGlossary = () => {
    if (suggestedGlossary) {
      setSelectedGlossary(suggestedGlossary.id);
    }
  };

  // Handle save template
  const handleSaveTemplate = (template: any) => {
    console.log('[HostSetup] Template saved:', template);
    // In production, this would save to backend
    // For now, just apply the template to current session
    setMeetingType(template.meeting_type);
    setSourceLanguage(template.source_language);
    setTargetLanguages(template.target_languages);
    if (template.glossary_id) {
      setSelectedGlossary(template.glossary_id);
    }
    if (template.host_instructions) {
      setHostInstructions(template.host_instructions);
    }
    setShowCreateTemplateModal(false);
  };

  // Handle upload glossary
  const handleUploadGlossary = (glossary: any) => {
    console.log('[HostSetup] Glossary uploaded:', glossary);
    // In production, this would upload to backend and return glossary ID
    // For now, just create a temporary ID and use it
    const tempGlossaryId = `temp-${Date.now()}`;
    setSelectedGlossary(tempGlossaryId);
    setShowUploadGlossaryModal(false);
    alert(`Glossary "${glossary.name}" uploaded successfully with ${glossary.termCount} terms!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Navigation Header */}
      <NavigationHeader
        title="Start Translation"
        onBack={onCancel}
        backLabel="Back"
        actions={
          <NavigationAction
            onClick={onSettings}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label=""
          />
        }
      />

      {/* Quick Start */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Template Selector */}
            <Select
              label="Load Template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              options={[
                { value: 'none', label: 'None (Start Fresh)' },
                ...MOCK_TEMPLATES.map(t => ({ value: t.id, label: t.name })),
                { value: 'create-new', label: '+ Create New Template' }
              ]}
              aria-label="Load template for quick setup. Choose a saved template to automatically fill language and meeting settings"
            />

            {/* Meeting Type Selector */}
            <Select
              label="Meeting Type"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value as MeetingType)}
              options={MEETING_TYPES.map(type => ({
                value: type.value,
                label: type.label
              }))}
              aria-label="Select meeting type for AI translation context optimization"
              aria-required="false"
            />

            {/* Glossary Suggestion */}
            {suggestedGlossary && !selectedGlossary && (
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
                <p className="text-sm text-teal-900 dark:text-teal-100 mb-3">
                  Suggested Glossary: <strong>{suggestedGlossary.name}</strong> ({suggestedGlossary.term_count} terms)
                </p>
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" onClick={useSuggestedGlossary}>
                    Use This Glossary
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowAdvanced(true)}>
                    Choose Different
                  </Button>
                </div>
              </div>
            )}

            {/* Daily Free Tier Info */}
            {isDailyFreeTier && dailyMinutesRemaining > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                  Daily Free Tier Active
                </p>
                <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                  <p>Minutes Remaining Today: {dailyMinutesRemaining} of 15</p>
                  <p>Resets: Daily at midnight</p>
                  <p>Languages: Up to 2 per session</p>
                  <p className="text-xs pt-1 text-green-700 dark:text-green-300">
                    Upgrade to PAYG for unlimited usage ($45-95/hour)
                  </p>
                </div>
              </div>
            )}

            {/* Daily Free Tier Exhausted Warning */}
            {isDailyFreeTier && dailyMinutesRemaining === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                      Daily Free Tier: No Minutes Remaining
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                      You've used your 15 free minutes today. Come back tomorrow for another 15 minutes, or upgrade to Pay-As-You-Go for unlimited usage.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="primary" size="sm" onClick={onOpenTierModal}>
                        Upgrade to PAYG ($45-95/hour)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYG Tier Selection/Status (only for non-free-tier users) */}
            {isPAYG && !isDailyFreeTier && (
              <>
                {/* Case 1: No tier set yet - Show tier selector with info banner */}
                {!user?.subscription_tier && (
                  <div className="space-y-4">
                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Choose Your Tier for This Month
                          </h4>
                          <p className="text-xs text-blue-800 dark:text-blue-200">
                            Select your pricing tier below. This tier will apply to all sessions this billing period. You can change your tier next month if your needs change.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tier Selector */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Tier for This Billing Period
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
                          <input
                            type="radio"
                            name="tier"
                            value="starter"
                            checked={selectedTier === 'starter'}
                            onChange={(e) => handleTierSelection(e.target.value)}
                            className="w-4 h-4 text-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                            aria-label="Starter tier - $45 per hour with 1 translation"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">Starter - $45/hr</span>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              1 translation (2 total languages) • +$10/hr per extra language
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
                          <input
                            type="radio"
                            name="tier"
                            value="professional"
                            checked={selectedTier === 'professional'}
                            onChange={(e) => handleTierSelection(e.target.value)}
                            className="w-4 h-4 text-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                            aria-label="Professional tier - $75 per hour with 5 translations"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">Professional - $75/hr</span>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              5 translations (6 total languages) • +$8/hr per extra language
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
                          <input
                            type="radio"
                            name="tier"
                            value="enterprise"
                            checked={selectedTier === 'enterprise'}
                            onChange={(e) => handleTierSelection(e.target.value)}
                            className="w-4 h-4 text-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                            aria-label="Enterprise tier - $105 per hour with 15 translations"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">Enterprise - $105/hr</span>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              15 translations (16 total languages) • +$6/hr per extra language
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {/* Pricing Info Button */}
                      <div className="pt-2 text-center">
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => {
                            alert(`💰 PRICING DETAILS:\n\n` +
                              `🔸 STARTER: $45/hour\n` +
                              `• 1 translation (2 total languages)\n` +
                              `• Language overage: +$10/hr per extra language\n` +
                              `• Participant base: 25 people included\n` +
                              `• Participant overage: +25% per 100 over base\n\n` +
                              `🔸 PROFESSIONAL: $75/hour\n` +
                              `• 5 translations (6 total languages)\n` +
                              `• Language overage: +$8/hr per extra language\n` +
                              `• Participant base: 100 people included\n` +
                              `• Participant overage: +25% per 100 over base\n\n` +
                              `🔸 ENTERPRISE: $105/hour\n` +
                              `• 15 translations (16 total languages)\n` +
                              `• Language overage: +$6/hr per extra language\n` +
                              `• Participant base: 500 people included\n` +
                              `• Participant overage: +25% per 100 over base\n\n` +
                              `💡 BILLING NOTES:\n` +
                              `• No setup fees or monthly minimums\n` +
                              `• Pay only for actual session time\n` +
                              `• All overages calculated per session hour\n` +
                              `• Change tiers monthly on the 1st`);
                          }}
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-xs"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          See Pricing Info
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 2: Tier already set - Show locked tier status */}
                {user?.subscription_tier && (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Current Tier: {user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)} (${user.subscription_tier === 'starter' ? '45' : user.subscription_tier === 'professional' ? '75' : '95'}/hr)
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          This tier applies to all sessions this billing period.
                        </p>
                        {user.billing_period_end && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            You can change your tier starting {user.billing_period_end}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* HIDDEN: Estimated Cost Calculator - removed as duplicate/unhelpful information */}
            {/* 
            {isPAYG && !isDailyFreeTier && targetLanguages.length > 0 && (selectedTier || user?.subscription_tier) && (() => {
              // Cost calculation section commented out per user request
            })()}
            */}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Languages</CardTitle>
            <Badge variant="warning">Required</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Source Language */}
            <Select
              label="Source Language"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              options={LANGUAGES.map(lang => ({
                value: lang.code,
                label: lang.name
              }))}
              aria-label="Select the language being spoken in the meeting"
              aria-required="true"
            />

            {/* Target Languages */}
            <div className="space-y-3" role="group" aria-labelledby="target-languages-label">
              <label
                id="target-languages-label"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Target Languages {!isPAYG && `(up to ${languageLimit} in your plan)`}
              </label>

              {/* Language Selection Disabled Message */}
              {isLanguageSelectionDisabled && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Select a tier above to enable language selection
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Target language limits depend on your chosen tier.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Selection Guidance - MOVED TO TOP */}
              {!isLanguageSelectionDisabled && requiredLanguageCount && (
                <div className={`p-3 rounded-lg border ${
                  hasCorrectLanguageCount 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                    : needsMoreLanguages
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                }`}>
                  <div className="flex items-start gap-2">
                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      hasCorrectLanguageCount 
                        ? 'text-green-600 dark:text-green-400' 
                        : needsMoreLanguages
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {hasCorrectLanguageCount ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : needsMoreLanguages ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      )}
                    </svg>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        hasCorrectLanguageCount 
                          ? 'text-green-800 dark:text-green-200' 
                          : needsMoreLanguages
                          ? 'text-blue-800 dark:text-blue-200'
                          : 'text-amber-800 dark:text-amber-200'
                      }`}>
                        {hasCorrectLanguageCount 
                          ? `Perfect! You've selected ${requiredLanguageCount} language${requiredLanguageCount !== 1 ? 's' : ''} for translation.`
                          : needsMoreLanguages
                          ? `Select ${requiredLanguageCount - targetLanguages.length} more language${requiredLanguageCount - targetLanguages.length !== 1 ? 's' : ''} to continue`
                          : `You've selected too many languages. Please remove ${targetLanguages.length - requiredLanguageCount} language${targetLanguages.length - requiredLanguageCount !== 1 ? 's' : ''}.`
                        }
                      </p>
                      <p className={`text-xs mt-1 ${
                        hasCorrectLanguageCount 
                          ? 'text-green-700 dark:text-green-300' 
                          : needsMoreLanguages
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        {hasCorrectLanguageCount 
                          ? 'You can now start your translation session.'
                          : needsMoreLanguages
                          ? `Your ${effectiveTier} tier requires exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for translation.`
                          : `Your ${effectiveTier} tier allows exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''}.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Search */}
              <Input
                type="text"
                placeholder={isLanguageSelectionDisabled ? "Select a tier first..." : "Search languages..."}
                value={languageSearch}
                onChange={(e) => setLanguageSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && languageSearch) {
                    setLanguageSearch('');
                  }
                }}
                disabled={isLanguageSelectionDisabled}
                aria-label="Search languages by name or code"
              />

              {/* Language Grid */}
              <div className={`border rounded-lg p-4 max-h-96 overflow-y-auto ${
                isLanguageSelectionDisabled 
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 opacity-60' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}>
                {isLoadingLanguages ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredLanguages.map(lang => (
                      <Checkbox
                        key={lang.code}
                        label={lang.name}
                        checked={targetLanguages.includes(lang.code)}
                        onChange={() => {
                          toggleLanguage(lang.code);
                          // If this is the last language to reach the limit, move focus to Advanced Options
                          if (!targetLanguages.includes(lang.code) && targetLanguages.length + 1 === languageLimit) {
                            setTimeout(() => {
                              advancedOptionsButtonRef.current?.focus();
                            }, 100);
                          }
                        }}
                        disabled={
                          isLanguageSelectionDisabled || 
                          (!targetLanguages.includes(lang.code) && targetLanguages.length >= languageLimit)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Count */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLanguageSelectionDisabled ? (
                  "Select a tier above to view language limits"
                ) : (
                  <>
                    Selected: {targetLanguages.length} of {languageLimit} language{targetLanguages.length !== 1 ? 's' : ''}
                    {targetLanguages.length > 0 && ` (${targetLanguages.map(code => filteredLanguages.find(l => l.code === code)?.name || LANGUAGES.find(l => l.code === code)?.name).filter(Boolean).join(', ')})`}
                  </>
                )}
              </p>



              {/* Screen reader announcement for language selection */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {targetLanguages.length > 0 &&
                  `${targetLanguages.length} language${targetLanguages.length !== 1 ? 's' : ''} selected: ${targetLanguages.map(code => LANGUAGES.find(l => l.code === code)?.name).filter(Boolean).join(', ')}`
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Options */}
      <Card variant="default" padding="lg" className="border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
        <button
          ref={advancedOptionsButtonRef}
          onClick={() => setShowAdvanced(!showAdvanced)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowAdvanced(!showAdvanced);
            }
            if (e.key === 'Escape' && showAdvanced) {
              setShowAdvanced(false);
            }
          }}
          className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg p-2 -m-2"
          aria-expanded={showAdvanced}
          aria-controls="advanced-options-content"
          id="advanced-options-toggle"
        >
          <div className="flex items-center gap-3">
            <CardTitle>Advanced Options</CardTitle>
            <Badge variant="neutral">Optional</Badge>
          </div>
          <span className="text-gray-500 dark:text-gray-400" aria-hidden="true">
            {showAdvanced ? '[Collapse ▲]' : '[Expand ▼]'}
          </span>
        </button>

        {showAdvanced && (
          <div 
            id="advanced-options-content"
            role="region"
            aria-labelledby="advanced-options-toggle"
          >
            <CardContent className="mt-6">
            <div className="space-y-6">
              {/* TTS Toggle */}
              <div className="flex items-center gap-2">
                <Toggle
                  label="Text-to-Speech (TTS)"
                  description="Audio playback of translations for participants"
                  enabled={ttsEnabled}
                  onChange={setTtsEnabled}
                />
                <HelpIcon
                  tooltip="Text-to-Speech converts translated text into audio. When enabled, participants will hear spoken translations in addition to seeing caption text."
                  position="top"
                />
              </div>

              {/* Confidence Threshold */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confidence Threshold: {confidenceThreshold}%
                  </label>
                  <HelpIcon
                    tooltip="Filters out translations with low AI confidence scores. Higher values (70-100%) show only high-quality translations. Lower values (0-50%) show all translations even if uncertain."
                    position="top"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  aria-label="Confidence threshold slider. Filter translations based on AI confidence score"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={confidenceThreshold}
                  aria-valuetext={`${confidenceThreshold} percent confidence threshold`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Filter low-confidence translations (0-100%)
                </p>
              </div>

              {/* Show Partial Results */}
              <div className="flex items-center gap-2">
                <Toggle
                  label="Show Partial Results"
                  description="Display captions as they're being processed"
                  enabled={showPartialResults}
                  onChange={setShowPartialResults}
                />
                <HelpIcon
                  tooltip="Shows captions in real-time as words are being transcribed, before the full sentence is complete. Useful for following along, but may show incomplete phrases."
                  position="top"
                />
              </div>

              {/* Glossary Selector */}
              <Select
                label="Glossary"
                value={selectedGlossary || ''}
                onChange={(e) => setSelectedGlossary(e.target.value || null)}
                options={[
                  { value: '', label: 'None' },
                  ...MOCK_GLOSSARIES.map(g => ({
                    value: g.id,
                    label: `${g.name} (${g.term_count} terms)`
                  })),
                  { value: 'upload-new', label: '+ Upload New CSV' }
                ]}
              />

              {/* Overage Permissions - Only show for PAYG users */}
              {!isDailyFreeTier && (
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Session Limits</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Toggle
                        label="Allow Language Requests"
                        description="Participants can request additional languages beyond your tier limit"
                        enabled={allowLanguageRequests}
                        onChange={setAllowLanguageRequests}
                      />
                      <HelpIcon
                        tooltip="When enabled, participants can request translations in languages not pre-selected. You'll receive live approval prompts with options: Yes, No, or Approve All. Overage charges apply only for actual usage minutes."
                        position="top"
                      />
                    </div>

                    {allowLanguageRequests && (() => {
                      const tier = selectedTier || user?.subscription_tier;
                      const tierData = tier ? pricingConfig.getPaygTier(tier) : null;
                      const baseRate = tierData?.baseRatePerHour || 0;
                      const overageCost = tierData?.overageRatePerHour || (baseRate * 0.5); // Use configured overage rate or 50% of base
                      const perMinuteCost = (overageCost / 60);
                      
                      return (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                          <p className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Language Overage Cost:</strong> ${overageCost.toFixed(2)}/hour (${perMinuteCost.toFixed(3)}/min) per additional language
                            {tierData && ` (${tierData.name} tier)`}
                            <br />
                            <strong>Billing:</strong> Charged only for actual usage minutes when the language is actively requested
                            <br />
                            <strong>Live Control:</strong> You'll approve each request during the session with options: <em>Yes / No / Approve All</em>
                          </p>
                        </div>
                      );
                    })()}

                    <div className="flex items-center gap-2">
                      <Toggle
                        label={`Allow ${calculateParticipantMultiplier(1).base_threshold}+ Participants`}
                        description={`Allow more than ${calculateParticipantMultiplier(1).base_threshold} participants with rate increase`}
                        enabled={allowParticipantOverage}
                        onChange={setAllowParticipantOverage}
                      />
                      <HelpIcon
                        tooltip={`When enabled, you'll be prompted when the ${calculateParticipantMultiplier(1).base_threshold + 1}th participant joins. Rate increases by ${(calculateParticipantMultiplier(1).increment_rate * 100).toFixed(0)}% for every ${calculateParticipantMultiplier(1).increment_threshold} participants above ${calculateParticipantMultiplier(1).base_threshold}.`}
                        position="top"
                      />
                    </div>
                    
                    {allowParticipantOverage && (() => {
                      const tier = selectedTier || user?.subscription_tier;
                      const tierData = tier ? pricingConfig.getPaygTier(tier) : null;
                      const baseRate = tierData?.baseRatePerHour || 0;
                      const participantData = calculateParticipantMultiplier(1);
                      const overageRate = baseRate * participantData.increment_rate;
                      
                      return (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                          <p className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Participant Overage Cost:</strong> +${overageRate.toFixed(2)}/hour per {participantData.increment_threshold} participants over {participantData.base_threshold}
                            {tierData && ` (${(participantData.increment_rate * 100).toFixed(0)}% of ${tierData.name} base rate)`}
                            <br />
                            You'll be prompted for approval when participant #{participantData.base_threshold + 1} joins.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Host Instructions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Host Instructions (500 char limit)
                </label>
                <textarea
                  value={hostInstructions}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setHostInstructions(e.target.value);
                    }
                  }}
                  placeholder="Type instructions for participants here..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {hostInstructions.length}/500 characters
                </p>
              </div>
            </div>
          </CardContent>
          </div>
        )}
      </Card>

      {/* PRIMARY ACTIONS - Start Translation & Cancel */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Ready to Start?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Validation Message - Show if no tier selected for PAYG users */}
            {isPAYG && !isDailyFreeTier && !selectedTier && !user?.subscription_tier && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Tier Selection Required
                    </p>
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      Please select a pricing tier above before starting your translation session. Next, you'll add your payment method, then choose your tier when you start your first session.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Message - Show if no target languages selected */}
            {targetLanguages.length === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      Languages Required
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      Please select at least one target language from the "Languages" section above before starting your translation session.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Start Button - Disabled if prerequisites not met */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              disabled={
                !hasCorrectLanguageCount ||
                (isDailyFreeTier && dailyMinutesRemaining === 0) ||
                (isPAYG && !isDailyFreeTier && !selectedTier && !user?.subscription_tier)
              }
              aria-disabled={
                !hasCorrectLanguageCount ||
                (isDailyFreeTier && dailyMinutesRemaining === 0) ||
                (isPAYG && !isDailyFreeTier && !selectedTier && !user?.subscription_tier)
              }
              aria-describedby={
                !hasCorrectLanguageCount ? "start-button-disabled-reason" : undefined
              }
              className="w-full text-lg py-4"
              title={
                needsMoreLanguages && requiredLanguageCount
                  ? `Please select exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for your ${effectiveTier} tier`
                  : hasTooManyLanguages && requiredLanguageCount
                  ? `Please select exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for your ${effectiveTier} tier`
                  : targetLanguages.length === 0
                  ? "Please select target languages"
                  : isDailyFreeTier && dailyMinutesRemaining === 0
                  ? "No free minutes remaining today - Upgrade to PAYG for unlimited usage"
                  : isPAYG && !isDailyFreeTier && !selectedTier && !user?.subscription_tier
                  ? "Please select a pricing tier above"
                  : undefined
              }
            >
              {needsMoreLanguages && requiredLanguageCount
                ? `Select ${requiredLanguageCount - targetLanguages.length} More Language${requiredLanguageCount - targetLanguages.length !== 1 ? 's' : ''}`
                : hasTooManyLanguages && requiredLanguageCount
                ? `Remove ${targetLanguages.length - requiredLanguageCount} Language${targetLanguages.length - requiredLanguageCount !== 1 ? 's' : ''}`
                : targetLanguages.length === 0
                ? "Select Languages to Continue"
                : isDailyFreeTier && dailyMinutesRemaining === 0
                ? "No Minutes Remaining - Upgrade to PAYG"
                : isPAYG && !isDailyFreeTier && !selectedTier && !user?.subscription_tier
                ? "Select Tier to Continue"
                : isStarting
                ? "Starting Translation..."
                : "Start Translation Session"
              }
            </Button>

            {!hasCorrectLanguageCount && (
              <p id="start-button-disabled-reason" className="sr-only">
                {needsMoreLanguages && requiredLanguageCount
                  ? `Button disabled: Please select exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for your ${effectiveTier} tier. You have selected ${targetLanguages.length}.`
                  : hasTooManyLanguages && requiredLanguageCount
                  ? `Button disabled: Please select exactly ${requiredLanguageCount} target language${requiredLanguageCount !== 1 ? 's' : ''} for your ${effectiveTier} tier. You have selected ${targetLanguages.length}, which is too many.`
                  : 'Button disabled: Please select target languages from the Languages section above'
                }
              </p>
            )}

            {/* Cancel Button - Secondary action */}
            <Button
              variant="secondary"
              size="lg"
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Status (PAYG only, with payment method added) - Moved to bottom for better UX */}
      {isPAYG && user && user.payment_method_added && (
        <Card variant="default" padding="lg" className="mt-6">
          <CardHeader>
            <CardTitle>Billing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Status: 🟢 Active
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Usage This Month: <span className="font-semibold text-teal-600">${user.unpaid_usage?.toFixed(2) || '0.00'}</span>
              </p>
              {user.billing_period_start && user.billing_period_end && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Billing Period: {user.billing_period_start} to {user.billing_period_end}
                </p>
              )}
              {isHighUsage && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    High usage alert: ${user.unpaid_usage?.toFixed(2)} will be billed at end of month.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={showCreateTemplateModal}
        onClose={() => setShowCreateTemplateModal(false)}
        onSave={handleSaveTemplate}
      />

      {/* Upload Glossary Modal */}
      <UploadGlossaryModal
        isOpen={showUploadGlossaryModal}
        onClose={() => setShowUploadGlossaryModal(false)}
        onUpload={handleUploadGlossary}
      />

      {/* Tier Confirmation Modal */}
      <TierConfirmationModal
        isOpen={showTierConfirmation}
        onClose={handleCancelTierSelection}
        onConfirm={handleConfirmTierSelection}
        selectedTier={pendingTierSelection || ''}
        isChangingTier={!!selectedTier || !!user?.subscription_tier}
      />
    </div>
  );
}
