// Constants for MeetingSync Zoom App
// Date: October 10, 2025

import type { Language, MeetingType, ParticipantMultiplier, LanguageOverage } from '../types';

// ============================================
// PRICING TIERS (Dynamic Configuration)
// ============================================

// Re-export PRICING_TIERS from pricingManager for backwards compatibility
// This is now dynamically generated from pricing configuration
export { PRICING_TIERS } from './pricingManager';

// ============================================
// LANGUAGES (50+ supported)
// ============================================

export const LANGUAGES: Language[] = [
  // Tier: Starter (3 most common for North American business)
  { code: 'en', name: 'English', native_name: 'English', flag: '🇺🇸', tier_required: 'starter' },
  { code: 'es', name: 'Spanish', native_name: 'Español', flag: '🇪🇸', tier_required: 'starter' },
  { code: 'fr', name: 'French', native_name: 'Français', flag: '🇫🇷', tier_required: 'starter' },

  // Tier: Professional (7 total - adds 4 more major business languages)
  { code: 'de', name: 'German', native_name: 'Deutsch', flag: '🇩🇪', tier_required: 'professional' },
  { code: 'it', name: 'Italian', native_name: 'Italiano', flag: '��', tier_required: 'professional' },
  { code: 'pt', name: 'Portuguese', native_name: 'Português', flag: '🇵🇹', tier_required: 'professional' },
  { code: 'ja', name: 'Japanese', native_name: '日本語', flag: '��', tier_required: 'professional' },

  // Tier: Enterprise (ALL remaining languages - 50+ total)
  { code: 'zh', name: 'Chinese', native_name: '中文', flag: '��', tier_required: 'enterprise' },
  { code: 'ar', name: 'Arabic', native_name: 'العربية', flag: '��', tier_required: 'enterprise' },
  { code: 'ru', name: 'Russian', native_name: 'Русский', flag: '🇷🇺', tier_required: 'enterprise' },
  { code: 'ko', name: 'Korean', native_name: '한국어', flag: '🇰🇷', tier_required: 'enterprise' },
  { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', flag: '🇮🇳', tier_required: 'enterprise' },

  // Tier: Enterprise (50+)
  { code: 'nl', name: 'Dutch', native_name: 'Nederlands', flag: '🇳🇱', tier_required: 'enterprise' },
  { code: 'pl', name: 'Polish', native_name: 'Polski', flag: '🇵🇱', tier_required: 'enterprise' },
  { code: 'tr', name: 'Turkish', native_name: 'Türkçe', flag: '🇹🇷', tier_required: 'enterprise' },
  { code: 'sv', name: 'Swedish', native_name: 'Svenska', flag: '🇸🇪', tier_required: 'enterprise' },
  { code: 'da', name: 'Danish', native_name: 'Dansk', flag: '🇩🇰', tier_required: 'enterprise' },
  { code: 'fi', name: 'Finnish', native_name: 'Suomi', flag: '🇫🇮', tier_required: 'enterprise' },
  { code: 'no', name: 'Norwegian', native_name: 'Norsk', flag: '🇳🇴', tier_required: 'enterprise' },
  { code: 'cs', name: 'Czech', native_name: 'Čeština', flag: '🇨🇿', tier_required: 'enterprise' },
  { code: 'el', name: 'Greek', native_name: 'Ελληνικά', flag: '🇬🇷', tier_required: 'enterprise' },
  { code: 'he', name: 'Hebrew', native_name: 'עברית', flag: '🇮🇱', tier_required: 'enterprise' },
  { code: 'hu', name: 'Hungarian', native_name: 'Magyar', flag: '🇭🇺', tier_required: 'enterprise' },
  { code: 'id', name: 'Indonesian', native_name: 'Bahasa Indonesia', flag: '🇮🇩', tier_required: 'enterprise' },
  { code: 'ms', name: 'Malay', native_name: 'Bahasa Melayu', flag: '🇲🇾', tier_required: 'enterprise' },
  { code: 'ro', name: 'Romanian', native_name: 'Română', flag: '🇷🇴', tier_required: 'enterprise' },
  { code: 'sk', name: 'Slovak', native_name: 'Slovenčina', flag: '🇸🇰', tier_required: 'enterprise' },
  { code: 'th', name: 'Thai', native_name: 'ไทย', flag: '🇹🇭', tier_required: 'enterprise' },
  { code: 'uk', name: 'Ukrainian', native_name: 'Українська', flag: '🇺🇦', tier_required: 'enterprise' },
  { code: 'vi', name: 'Vietnamese', native_name: 'Tiếng Việt', flag: '🇻🇳', tier_required: 'enterprise' },
  { code: 'bn', name: 'Bengali', native_name: 'বাংলা', flag: '🇧🇩', tier_required: 'enterprise' },
  { code: 'ca', name: 'Catalan', native_name: 'Català', flag: '🇪🇸', tier_required: 'enterprise' },
  { code: 'hr', name: 'Croatian', native_name: 'Hrvatski', flag: '🇭🇷', tier_required: 'enterprise' },
  { code: 'fa', name: 'Persian', native_name: 'فارسی', flag: '🇮🇷', tier_required: 'enterprise' },
  { code: 'ta', name: 'Tamil', native_name: 'தமிழ்', flag: '🇮🇳', tier_required: 'enterprise' },
  { code: 'te', name: 'Telugu', native_name: 'తెలుగు', flag: '🇮🇳', tier_required: 'enterprise' },
  { code: 'ur', name: 'Urdu', native_name: 'اردو', flag: '🇵🇰', tier_required: 'enterprise' },
  { code: 'bg', name: 'Bulgarian', native_name: 'Български', flag: '🇧🇬', tier_required: 'enterprise' },
  { code: 'sr', name: 'Serbian', native_name: 'Српски', flag: '🇷🇸', tier_required: 'enterprise' },
  { code: 'sl', name: 'Slovenian', native_name: 'Slovenščina', flag: '🇸🇮', tier_required: 'enterprise' },
  { code: 'lt', name: 'Lithuanian', native_name: 'Lietuvių', flag: '🇱🇹', tier_required: 'enterprise' },
  { code: 'lv', name: 'Latvian', native_name: 'Latviešu', flag: '🇱🇻', tier_required: 'enterprise' },
  { code: 'et', name: 'Estonian', native_name: 'Eesti', flag: '🇪🇪', tier_required: 'enterprise' },
  { code: 'is', name: 'Icelandic', native_name: 'Íslenska', flag: '🇮🇸', tier_required: 'enterprise' },
  { code: 'mt', name: 'Maltese', native_name: 'Malti', flag: '🇲🇹', tier_required: 'enterprise' },
  { code: 'ga', name: 'Irish', native_name: 'Gaeilge', flag: '🇮🇪', tier_required: 'enterprise' },
  { code: 'cy', name: 'Welsh', native_name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', tier_required: 'enterprise' },
  { code: 'af', name: 'Afrikaans', native_name: 'Afrikaans', flag: '🇿🇦', tier_required: 'enterprise' },
  { code: 'sw', name: 'Swahili', native_name: 'Kiswahili', flag: '🇰🇪', tier_required: 'enterprise' },
  { code: 'zu', name: 'Zulu', native_name: 'isiZulu', flag: '🇿🇦', tier_required: 'enterprise' },
  { code: 'fil', name: 'Filipino', native_name: 'Filipino', flag: '🇵🇭', tier_required: 'enterprise' },
];

// ============================================
// FREE TRIAL CONFIGURATION
// ============================================

export const FREE_TRIAL = {
  SESSION_LIMIT: 3,
  DURATION_MINUTES_PER_SESSION: 30,
  TOTAL_MINUTES: 90,
  LANGUAGES_INCLUDED: ['en', 'es', 'fr'], // Starter tier languages
  REQUIRED_ZOOM_ACCOUNT_TYPE: [2, 3], // Pro/Business/Enterprise (paid accounts only)
} as const;

// ============================================
// MEETING TYPES
// ============================================

export const MEETING_TYPES: Array<{ value: MeetingType; label: string; description: string }> = [
  {
    value: 'general',
    label: 'General Meeting',
    description: 'No specialized terminology'
  },
  {
    value: 'medical',
    label: 'Medical / Healthcare',
    description: 'Medical terminology and procedures'
  },
  {
    value: 'technical',
    label: 'Technical / Engineering',
    description: 'Software, engineering, IT terminology'
  },
  {
    value: 'legal',
    label: 'Legal / Contracts',
    description: 'Legal documents and terminology'
  },
  {
    value: 'business',
    label: 'Business / Finance',
    description: 'Business operations and finance'
  },
  {
    value: 'academic',
    label: 'Academic / Education',
    description: 'Educational content and research'
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Select glossary manually'
  }
];

// ============================================
// GLOSSARY MAPPING BY MEETING TYPE
// ============================================

/**
 * Maps meeting types to their default glossary IDs
 * Used for auto-suggesting glossaries based on meeting type
 */
export const GLOSSARIES_BY_TYPE: Record<MeetingType, string | null> = {
  general: null,
  medical: 'glossary_medical_001',
  technical: 'glossary_product_001', // Using product glossary for technical
  legal: 'glossary_legal_001',
  business: null,
  academic: null,
  custom: null
};

// ============================================
// ZOOM SDK CONFIGURATION
// ============================================

export const ZOOM_SDK_CONFIG = {
  version: '0.16.29',
  capabilities: [
    'getMeetingContext',
    'getUserContext',
    'getRunningContext',
    'shareApp',
    'sendAppInvitation',
    'onShareApp',
    'onMeeting',
    'authorize'
  ],
  popoutSize: {
    width: 400,
    height: 600
  }
};

// ============================================
// APP CONFIGURATION
// ============================================

export const APP_CONFIG = {
  name: 'MeetingSync',
  version: '1.0.0',
  support_email: 'support@meetingsync.com',
  documentation_url: 'https://docs.meetingsync.com',

  // Free trial configuration
  free_trial: {
    sessions: 3,
    requires_paid_zoom: true
  },

  // Usage warnings
  usage_warning_thresholds: [0.8, 1.0, 1.2], // 80%, 100%, 120%

  // Default settings
  defaults: {
    source_language: 'en',
    confidence_threshold: 80,
    tts_enabled: false,
    show_partial_results: true,
    auto_export_transcript: false
  }
};

// ============================================
// UI CONSTANTS
// ============================================

export const CAPTION_FONT_SIZES = {
  small: 14,
  medium: 18,
  large: 24,
  'extra-large': 32
};

export const COLORS = {
  primary: '#14b8a6', // teal-500
  primary_dark: '#0d9488', // teal-600
  success: '#059669', // green-600
  error: '#dc2626', // red-600
  warning: '#eab308', // yellow-500
  info: '#2563eb' // blue-600
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find(lang => lang.code === code);
}

export function getLanguagesForTier(tier: 'starter' | 'professional' | 'enterprise'): Language[] {
  const tierOrder = ['starter', 'professional', 'enterprise'];
  const tierIndex = tierOrder.indexOf(tier);

  return LANGUAGES.filter(lang => {
    const langTierIndex = tierOrder.indexOf(lang.tier_required);
    return langTierIndex <= tierIndex;
  });
}

export function getTierForLanguageCount(count: number): 'starter' | 'professional' | 'enterprise' {
  if (count <= 5) return 'starter';
  if (count <= 12) return 'professional';
  return 'enterprise';
}

/**
 * Format currency amount
 * @deprecated Use pricingManager.formatCurrency() instead for configuration-aware formatting
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================
// V1 PRICING UTILITY FUNCTIONS
// ============================================

/**
 * Calculate participant multiplier based on participant count
 * @param participantCount - Current number of participants
 * @returns ParticipantMultiplier object with calculation details
 * 
 * @deprecated This function will be removed in favor of pricingManager.calculateParticipantMultiplier()
 * It's kept here for backwards compatibility during the transition.
 */
export function calculateParticipantMultiplier(participantCount: number): ParticipantMultiplier {
  const baseThreshold = 100;
  const incrementThreshold = 100;
  const incrementRate = 0.25;

  if (participantCount <= baseThreshold) {
    return {
      participant_count: participantCount,
      multiplier: 1.0,
      base_threshold: baseThreshold,
      increment_threshold: incrementThreshold,
      increment_rate: incrementRate
    };
  }

  const participantsOverBase = participantCount - baseThreshold;
  const increments = Math.ceil(participantsOverBase / incrementThreshold);
  const multiplier = 1.0 + (increments * incrementRate);

  return {
    participant_count: participantCount,
    multiplier: parseFloat(multiplier.toFixed(2)),
    base_threshold: baseThreshold,
    increment_threshold: incrementThreshold,
    increment_rate: incrementRate
  };
}

/**
 * Calculate total session cost including base cost, participant multiplier, and overages
 * @deprecated This function is deprecated. Use pricingManager.calculateSessionCost() instead for configuration-aware calculations
 * Temporarily returns zero to avoid circular dependency issues during migration.
 */
export function calculateSessionCost(
  _tier: 'starter' | 'professional' | 'enterprise',
  _durationHours: number,
  _participantCount: number,
  _overages: LanguageOverage[] = []
): number {
  console.warn('[calculateSessionCost] DEPRECATED: Use pricingManager.calculateSessionCost() instead');
  return 0; // Temporary stub during migration
}

/**
 * Calculate cost for a single overage language
 * Formula: (Minutes Active / 60) × Overage Rate × Multiplier
 * @param overage - Language overage object
 * @param sessionDurationMinutes - Total session duration in minutes
 * @param multiplierValue - Participant multiplier value (number, not object)
 * @returns Cost for this overage language
 */
export function calculateOverageCost(
  overage: LanguageOverage,
  sessionDurationMinutes: number,
  multiplierValue: number
): number {
  const removedAt = overage.removed_at_minutes ?? sessionDurationMinutes;
  const minutesActive = removedAt - overage.added_at_minutes;
  const hoursActive = minutesActive / 60;
  const cost = hoursActive * overage.overage_rate * multiplierValue;
  return parseFloat(cost.toFixed(2));
}

/**
 * Get language display name (returns string, not Language object)
 * FIX #4: Created to avoid React "Objects are not valid as a React child" error
 * @param code - Language code (e.g., 'es', 'fr')
 * @returns Language name as string (e.g., 'Spanish', 'French')
 */
export function getLanguageDisplayName(code: string): string {
  const language = LANGUAGES.find(lang => lang.code === code);
  return language?.name || code.toUpperCase();
}
