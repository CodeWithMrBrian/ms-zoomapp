/**
 * Dynamic Pricing Configuration System
 * 
 * This file defines the complete pricing configuration structure for MeetingSync.
 * All pricing variables, UI text, and business logic parameters are centralized here.
 * 
 * Benefits:
 * - Single source of truth for all pricing
 * - Easy updates without code changes
 * - Type-safe configuration with validation
 * - Dynamic UI text based on pricing values
 */

export interface FreeTierConfig {
  dailyMinutes: number;
  translationLimit: number; // Number of target languages (translations)
  totalLanguageLimit: number; // Source + target languages
  resetSchedule: 'daily' | 'weekly' | 'monthly';
  resetTime: string; // UTC time (e.g., "00:00")
  resetTimezone: string; // Timezone for reset (e.g., "UTC")
  description: string;
  shortDescription: string;
  features: string[];
  qualification: string;
}

export interface PaygTierConfig {
  id: string;
  name: string;
  baseRatePerHour: number;
  translationLimit: number; // Number of target languages included
  totalLanguageLimit: number; // Source + target languages
  overageRatePerHour: number; // Cost per additional language per hour
  features: string[];
  idealFor: string[];
  description: string;
  shortDescription: string;
  recommended?: boolean; // Mark as "Most Popular"
  badge?: string; // Optional badge text
}

export interface ParticipantScalingConfig {
  baseThreshold: number; // Participants before scaling kicks in
  incrementSize: number; // Participants per scaling bracket
  multiplierRate: number; // Multiplier increase per bracket
  maxMultiplier?: number; // Optional cap on multiplier
  formula: string; // Human-readable formula description
}

export interface UITextConfig {
  freeTier: {
    name: string;
    dailyLimitReached: string;
    minutesRemaining: string;
    minutesRemainingShort: string;
    upgradePrompt: string;
    resetMessage: string;
    noMinutesWarning: string;
    benefitsHeading: string;
    featuresHeading: string;
    qualificationText: string;
  };
  payg: {
    sectionTitle: string;
    billingDescription: string;
    participantScalingNote: string;
    overageExplanation: string;
    tierComparisonHeading: string;
  };
  general: {
    currency: string;
    currencySymbol: string;
    currencyCode: string;
    perHourSuffix: string;
    languageUnit: string;
    languageUnitPlural: string;
    translationUnit: string;
    translationUnitPlural: string;
    participantUnit: string;
    participantUnitPlural: string;
    minuteUnit: string;
    minuteUnitPlural: string;
  };
  buttons: {
    upgrade: string;
    selectTier: string;
    addPaymentMethod: string;
    startSession: string;
    learnMore: string;
  };
  tooltips: {
    participantScaling: string;
    overageCharges: string;
    languageLimit: string;
    dailyReset: string;
  };
}

export interface CompetitorConfig {
  name: string;
  entryPrice: number;
  hourlyRate: number;
  userLimit: number;
  advantages: string[];
}

export interface AdvancedConfig {
  azureAiCosts?: { [tier: string]: number };
  grossMargins?: { [tier: string]: number };
  competitorComparison?: CompetitorConfig[];
  businessMetrics?: {
    conversionRates?: { [tier: string]: number };
    churnRates?: { [tier: string]: number };
    upgradeThresholds?: { [key: string]: number };
  };
}

export interface PricingConfiguration {
  version: string;
  lastUpdated: string;
  environment: 'development' | 'staging' | 'production';
  
  freeTier: FreeTierConfig;
  paygTiers: { [key: string]: PaygTierConfig };
  participantScaling: ParticipantScalingConfig;
  uiText: UITextConfig;
  advanced?: AdvancedConfig;
}

// Default pricing configuration matching current values
export const DEFAULT_PRICING_CONFIG: PricingConfiguration = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  environment: 'development',

  freeTier: {
    dailyMinutes: 15,
    translationLimit: 2, // 2 translations
    totalLanguageLimit: 3, // 1 source + 2 target languages
    resetSchedule: 'daily',
    resetTime: '00:00',
    resetTimezone: 'UTC',
    description: 'Free daily translation service for Zoom Pro, Business, and Enterprise accounts',
    shortDescription: '15 min/day • 2 translations (3 total languages) • Resets daily • No credit card required',
    features: [
      '2 translations (3 total languages)',
      'Resets daily at midnight UTC',
      'No credit card required',
      'No participant limits during free usage',
      'All core translation features'
    ],
    qualification: 'Available for Zoom Pro, Business, and Enterprise accounts only'
  },

  paygTiers: {
    starter: {
      id: 'starter',
      name: 'Starter',
      baseRatePerHour: 45,
      translationLimit: 1,
      totalLanguageLimit: 2,
      overageRatePerHour: 10,
      features: [
        '1 translation (2 total languages)',
        'Same price for up to 100 participants (then +25% per 100 more)',
        'Overage: $10/hr per extra language',
        'Meeting recording',
        'PDF transcript export',
        'Email support'
      ],
      idealFor: [
        'Small meetings',
        'Single language pair',
        'Occasional use'
      ],
      description: 'Perfect for small teams with basic translation needs',
      shortDescription: '$45/hr • 1 translation (2 total languages)'
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      baseRatePerHour: 75,
      translationLimit: 5,
      totalLanguageLimit: 6,
      overageRatePerHour: 8,
      recommended: true,
      badge: 'MOST POPULAR',
      features: [
        '5 translations (6 total languages)',
        'Same price for up to 100 participants (then +25% per 100 more)',
        'Overage: $8/hr per extra language',
        'Meeting recording',
        'PDF transcript export',
        'Glossary support',
        'Template support',
        'Priority email + chat support'
      ],
      idealFor: [
        'Regular use',
        'Multiple languages',
        'Weekly meetings'
      ],
      description: 'Ideal for growing businesses with regular translation needs',
      shortDescription: '$75/hr • 5 translations (6 total languages)'
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      baseRatePerHour: 105,
      translationLimit: 15,
      totalLanguageLimit: 16,
      overageRatePerHour: 6,
      features: [
        '15 translations (16 total languages)',
        'Same price for up to 100 participants (then +25% per 100 more)',
        'Overage: $6/hr per extra language',
        'ALL 50+ languages available',
        'Meeting recording',
        'PDF transcript export',
        'Glossary support',
        'Template support',
        'Custom meeting types',
        'Priority support',
        'Dedicated account manager'
      ],
      idealFor: [
        'Large events',
        'Many languages',
        'Enterprise organizations'
      ],
      description: 'Complete solution for large organizations with global communication needs',
      shortDescription: '$105/hr • 15 translations (16 total languages)'
    }
  },

  participantScaling: {
    baseThreshold: 100,
    incrementSize: 100,
    multiplierRate: 0.25,
    formula: '1.0 + (CEILING((participants - 100) / 100) × 0.25)'
  },

  uiText: {
    freeTier: {
      name: 'Daily Free Tier',
      dailyLimitReached: 'Daily Free Tier: No Minutes Remaining',
      minutesRemaining: 'Minutes Remaining Today: {remaining} of {total}',
      minutesRemainingShort: '{remaining} min left today',
      upgradePrompt: 'You\'ve used your {total} free minutes today. Come back tomorrow for another {total} minutes, or upgrade to Pay-As-You-Go for unlimited usage.',
      resetMessage: 'Your free minutes reset daily at midnight UTC',
      noMinutesWarning: 'No free minutes remaining today - Upgrade to PAYG for unlimited usage',
      benefitsHeading: 'Daily Free Benefits',
      featuresHeading: 'What\'s Included',
      qualificationText: 'Requires Zoom Pro, Business, or Enterprise account'
    },
    payg: {
      sectionTitle: 'Pay-As-You-Go Plans',
      billingDescription: 'Add payment method (no upfront charge) • Select tier when starting sessions • Pay only for actual hours used',
      participantScalingNote: 'All plans: Same price for up to 100 participants, then +25% per additional 100 participants',
      overageExplanation: 'Overage languages are billed only for the time they were active during your session',
      tierComparisonHeading: 'Choose Your Plan'
    },
    general: {
      currency: 'USD',
      currencySymbol: '$',
      currencyCode: 'USD',
      perHourSuffix: '/hr',
      languageUnit: 'language',
      languageUnitPlural: 'languages',
      translationUnit: 'translation',
      translationUnitPlural: 'translations',
      participantUnit: 'participant',
      participantUnitPlural: 'participants',
      minuteUnit: 'minute',
      minuteUnitPlural: 'minutes'
    },
    buttons: {
      upgrade: 'Upgrade Plan',
      selectTier: 'Select This Plan',
      addPaymentMethod: 'Add Payment Method',
      startSession: 'Start Session',
      learnMore: 'Learn More'
    },
    tooltips: {
      participantScaling: 'Pricing increases by 25% for every 100 participants above the base threshold',
      overageCharges: 'Additional languages are charged only for the time they are active in your session',
      languageLimit: 'This plan includes the specified number of simultaneous translations',
      dailyReset: 'Free minutes reset automatically at midnight UTC every day'
    }
  },

  advanced: {
    azureAiCosts: {
      starter: 4.80,
      professional: 13.00,
      enterprise: 33.50
    },
    grossMargins: {
      starter: 89.3,
      professional: 82.7,
      enterprise: 65.1
    },
    competitorComparison: [
      {
        name: 'Wordly',
        entryPrice: 1500,
        hourlyRate: 150,
        userLimit: 50,
        advantages: [
          '97% lower entry cost',
          '70% cheaper per hour',
          'No user limits',
          'Pay-per-minute flexibility'
        ]
      }
    ]
  }
};

// Type guards and validation
export function isValidPricingConfig(config: any): config is PricingConfiguration {
  return (
    typeof config === 'object' &&
    typeof config.version === 'string' &&
    typeof config.freeTier === 'object' &&
    typeof config.paygTiers === 'object' &&
    typeof config.participantScaling === 'object' &&
    typeof config.uiText === 'object'
  );
}

export function validatePricingConfig(config: PricingConfiguration): string[] {
  const errors: string[] = [];

  // Validate free tier
  if (config.freeTier.dailyMinutes <= 0) {
    errors.push('Free tier daily minutes must be positive');
  }
  if (config.freeTier.translationLimit < 0) {
    errors.push('Free tier translation limit cannot be negative');
  }

  // Validate PAYG tiers
  Object.entries(config.paygTiers).forEach(([key, tier]) => {
    if (tier.baseRatePerHour <= 0) {
      errors.push(`${key} tier base rate must be positive`);
    }
    if (tier.overageRatePerHour < 0) {
      errors.push(`${key} tier overage rate cannot be negative`);
    }
    if (tier.translationLimit < 0) {
      errors.push(`${key} tier translation limit cannot be negative`);
    }
  });

  // Validate participant scaling
  if (config.participantScaling.baseThreshold <= 0) {
    errors.push('Participant scaling base threshold must be positive');
  }
  if (config.participantScaling.multiplierRate < 0) {
    errors.push('Participant scaling multiplier rate cannot be negative');
  }

  return errors;
}