// Mock Data for MeetingSync Zoom App - For GUI Testing
// Date: October 10, 2025

import type {
  User,
  Session,
  Template,
  Glossary,
  Invoice,
  Participant,
  Caption
} from '../types';

// ============================================
// MOCK USERS
// ============================================

export const MOCK_USER_PAYG_STARTER: User = {
  id: 'user_payg_starter_001',
  name: 'John Doe (Starter)',
  email: 'john.starter@company.com',
  zoom_account_type: 2, // Licensed (Pro account)
  billing_type: 'payg',
  subscription_tier: 'starter', // PAYG Starter tier ($45/hr, 1 translation = 2 total languages)
  unpaid_usage: 15.75, // Current month usage (postpaid)
  payment_method: 'Visa ****1234',
  payment_method_added: true,
  billing_period_start: '2025-10-01',
  billing_period_end: '2025-10-31',
  is_free_trial_active: false,
  free_trial_sessions_remaining: 0,
  free_trial_sessions_used: 3
};

export const MOCK_USER_PAYG_PROFESSIONAL: User = {
  id: 'user_payg_prof_001',
  name: 'John Doe (Professional)',
  email: 'john.professional@company.com',
  zoom_account_type: 2, // Licensed (Pro account)
  billing_type: 'payg',
  subscription_tier: 'professional', // PAYG Professional tier ($75/hr, 5 translations = 6 total languages)
  unpaid_usage: 23.50, // Current month usage (postpaid)
  payment_method: 'Visa ****1234',
  payment_method_added: true,
  billing_period_start: '2025-10-01',
  billing_period_end: '2025-10-31',
  is_free_trial_active: false,
  free_trial_sessions_remaining: 0,
  free_trial_sessions_used: 3
};

export const MOCK_USER_PAYG_ENTERPRISE: User = {
  id: 'user_payg_ent_001',
  name: 'John Doe (Enterprise)',
  email: 'john.enterprise@company.com',
  zoom_account_type: 2, // Licensed (Pro account)
  billing_type: 'payg',
  subscription_tier: 'enterprise', // PAYG Enterprise tier ($105/hr, 15 translations = 16 total languages)
  unpaid_usage: 47.50, // Current month usage (postpaid)
  payment_method: 'Visa ****1234',
  payment_method_added: true,
  billing_period_start: '2025-10-01',
  billing_period_end: '2025-10-31',
  is_free_trial_active: false,
  free_trial_sessions_remaining: 0,
  free_trial_sessions_used: 3
}

// Add a mock free trial user
export const MOCK_USER_FREE_TRIAL: User = {
  id: 'user_free_trial_001',
  name: 'Jane FreeTrial',
  email: 'jane.freetrial@company.com',
  zoom_account_type: 2,
  billing_type: 'payg',
  subscription_tier: undefined,
  unpaid_usage: 0,
  payment_method: undefined,
  payment_method_added: false,
  billing_period_start: '2025-10-01',
  billing_period_end: '2025-10-31',
  is_free_trial_active: true,
  free_trial_sessions_remaining: 2,
  free_trial_sessions_used: 1,
  is_free_tier: false
};

// PAYG user with payment method but no tier selected (tier selection state)
export const MOCK_USER_PAYG_NO_TIER: User = {
  id: 'user_payg_no_tier_001',
  name: 'Alex Johnson (PAYG - No Tier)',
  email: 'alex.johnson@company.com',
  zoom_account_type: 2, // Licensed (Pro account)
  billing_type: 'payg',
  subscription_tier: undefined, // No tier selected yet - should show tier selection
  unpaid_usage: 0, // No usage yet
  payment_method: 'Visa ****1234',
  payment_method_added: true, // Has payment method but no tier selected
  billing_period_start: '2025-10-01',
  billing_period_end: '2025-10-31',
  is_free_tier: false // Not free tier - PAYG user
};

// Default PAYG user (Professional tier for backward compatibility)
export const MOCK_USER_PAYG: User = MOCK_USER_PAYG_PROFESSIONAL;

export const MOCK_USER_FREE_TIER: User = {
  id: 'user_free_tier_001',
  name: 'Jane Smith',
  email: 'jane.smith@company.com',
  zoom_account_type: 2, // Licensed (required for MeetingSync)
  billing_type: 'payg',
  subscription_tier: undefined, // No tier - on free tier
  is_free_tier: true, // Free tier user (15 min/day forever)
  daily_free_minutes_used: 5, // Used 5 minutes today
  daily_free_minutes_remaining: 10, // 10 minutes left today
  daily_free_reset_date: new Date().toISOString().split('T')[0], // Today's date (YYYY-MM-DD)
  unpaid_usage: 0, // No paid usage
  payment_method_added: false // Haven't added payment method yet
};

// Backward compatibility alias

// REMOVED: Subscription billing type no longer supported (PAYG-only model)

export const MOCK_USER_FREE_ZOOM: User = {
  id: 'user_free_001',
  name: 'Bob Johnson',
  email: 'bob.johnson@email.com',
  zoom_account_type: 1, // Basic (Free) - cannot use MeetingSync
  billing_type: 'payg',
  unpaid_usage: 0,
  payment_method_added: false
};

// ============================================
// MOCK SESSIONS
// ============================================

export const MOCK_SESSIONS: Session[] = [
  {
    id: 'session_001',
    user_id: 'user_sub_001',
    date_time_start: '2025-10-09T10:30:00Z',
    date_time_end: '2025-10-09T12:00:00Z',
    duration_hours: 1.5,
    meeting_title: 'Weekly Team Standup',
    meeting_id: '123456789',
    host_name: 'Jane Smith',
    meeting_type: 'business',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de', 'zh'],
    glossary_name: 'Product Names',
    participant_count_total: 24,
    participant_count_viewing: 12,
    tier: 'professional',
    billing_type: 'payg',
    cost: 112.50, // 1.5 hours * $75/hr
    status: 'ended',
    transcript_url: 'https://cdn.meetingsync.com/transcripts/session_001.pdf',
    created_at: '2025-10-09T10:30:00Z'
  },
  {
    id: 'session_002',
    user_id: 'user_sub_001',
    date_time_start: '2025-10-07T14:00:00Z',
    date_time_end: '2025-10-07T14:45:00Z',
    duration_hours: 0.75,
    meeting_title: 'Client Presentation - Acme Corp',
    meeting_id: '987654321',
    host_name: 'Jane Smith',
    meeting_type: 'business',
    source_language: 'en',
    target_languages: ['es', 'pt'],
    glossary_name: 'Product Names',
    participant_count_total: 8,
    participant_count_viewing: 3,
    tier: 'professional',
    billing_type: 'payg',
    cost: 56.25, // 0.75 hours * $75/hr
    status: 'ended',
    transcript_url: 'https://cdn.meetingsync.com/transcripts/session_002.pdf',
    created_at: '2025-10-07T14:00:00Z'
  },
  {
    id: 'session_003',
    user_id: 'user_sub_001',
    date_time_start: '2025-10-05T09:00:00Z',
    date_time_end: '2025-10-05T11:00:00Z',
    duration_hours: 2.0,
    meeting_title: 'Medical Training Webinar',
    meeting_id: '555444333',
    host_name: 'Jane Smith',
    meeting_type: 'medical',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de', 'zh'],
    glossary_id: 'gloss_medical_001',
    glossary_name: 'Medical Terms',
    participant_count_total: 45,
    participant_count_viewing: 38,
    tier: 'professional',
    billing_type: 'payg',
    cost: 150.00, // 2.0 hours * $75/hr
    status: 'ended',
    transcript_url: 'https://cdn.meetingsync.com/transcripts/session_003.pdf',
    created_at: '2025-10-05T09:00:00Z'
  },
  {
    id: 'session_004',
    user_id: 'user_sub_001',
    date_time_start: '2025-10-03T15:30:00Z',
    date_time_end: '2025-10-03T17:15:00Z',
    duration_hours: 1.75,
    meeting_title: 'Q3 Planning Session',
    meeting_id: '111222333',
    host_name: 'Jane Smith',
    meeting_type: 'business',
    source_language: 'en',
    target_languages: ['es', 'fr'],
    participant_count_total: 18,
    participant_count_viewing: 6,
    tier: 'professional',
    billing_type: 'payg',
    cost: 131.25, // 1.75 hours * $75/hr
    status: 'ended',
    created_at: '2025-10-03T15:30:00Z'
  },
  {
    id: 'session_005',
    user_id: 'user_sub_001',
    date_time_start: '2025-10-01T13:00:00Z',
    date_time_end: '2025-10-01T14:30:00Z',
    duration_hours: 1.5,
    meeting_title: 'Product Roadmap Review',
    meeting_id: '444555666',
    host_name: 'Jane Smith',
    meeting_type: 'technical',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de'],
    participant_count_total: 32,
    participant_count_viewing: 15,
    tier: 'professional',
    billing_type: 'payg',
    cost: 112.50, // 1.5 hours * $75/hr
    status: 'ended',
    created_at: '2025-10-01T13:00:00Z'
  },
  {
    id: 'session_006',
    user_id: 'user_sub_001',
    date_time_start: '2025-09-28T10:00:00Z',
    date_time_end: '2025-09-28T11:15:00Z',
    duration_hours: 1.25,
    meeting_title: 'Sales Team Training',
    meeting_id: '777888999',
    host_name: 'Jane Smith',
    meeting_type: 'business',
    source_language: 'en',
    target_languages: ['es', 'pt'],
    participant_count_total: 22,
    participant_count_viewing: 9,
    tier: 'professional',
    billing_type: 'payg',
    cost: 93.75, // 1.25 hours * $75/hr
    status: 'ended',
    created_at: '2025-09-28T10:00:00Z'
  },
  {
    id: 'session_007',
    user_id: 'user_sub_001',
    date_time_start: '2025-09-25T16:00:00Z',
    date_time_end: '2025-09-25T17:30:00Z',
    duration_hours: 1.5,
    meeting_title: 'Customer Success Workshop',
    meeting_id: '222333444',
    host_name: 'Jane Smith',
    meeting_type: 'business',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de', 'zh'],
    participant_count_total: 28,
    participant_count_viewing: 12,
    tier: 'professional',
    billing_type: 'payg',
    cost: 112.50, // 1.5 hours * $75/hr
    status: 'ended',
    created_at: '2025-09-25T16:00:00Z'
  },
  {
    id: 'session_008',
    user_id: 'user_sub_001',
    date_time_start: '2025-09-22T11:00:00Z',
    date_time_end: '2025-09-22T12:00:00Z',
    duration_hours: 1.0,
    meeting_title: 'Monthly All-Hands',
    meeting_id: '888999000',
    host_name: 'Jane Smith',
    meeting_type: 'general',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de', 'zh', 'ja', 'pt'],
    participant_count_total: 156,
    participant_count_viewing: 78,
    tier: 'professional',
    billing_type: 'payg',
    cost: 75.00, // 1.0 hours * $75/hr
    status: 'ended',
    created_at: '2025-09-22T11:00:00Z'
  }
];

// ============================================
// MOCK TEMPLATES
// ============================================

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'template_001',
    user_id: 'user_sub_001',
    name: 'Weekly Team Meeting',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de'],
    meeting_type: 'business',
    tts_enabled: false,
    confidence_threshold: 80,
    show_partial_results: true,
    host_instructions: 'Please mute when not speaking.',
    last_used: '2025-10-09T10:30:00Z',
    created_at: '2025-09-15T08:00:00Z'
  },
  {
    id: 'template_002',
    user_id: 'user_sub_001',
    name: 'Monthly All-Hands',
    source_language: 'en',
    target_languages: ['es', 'fr', 'de', 'zh', 'ja', 'pt', 'it', 'ru', 'ko', 'ar', 'hi', 'nl'],
    meeting_type: 'general',
    glossary_id: 'gloss_product_001',
    tts_enabled: true,
    confidence_threshold: 75,
    show_partial_results: true,
    host_instructions: 'Translation is available in 12 languages. Select your preferred language from the Apps panel.',
    last_used: '2025-09-22T11:00:00Z',
    created_at: '2025-08-01T10:00:00Z'
  },
  {
    id: 'template_003',
    user_id: 'user_sub_001',
    name: 'Client Presentation',
    source_language: 'en',
    target_languages: ['es', 'pt'],
    meeting_type: 'business',
    glossary_id: 'gloss_product_001',
    tts_enabled: false,
    confidence_threshold: 85,
    show_partial_results: false,
    last_used: undefined,
    created_at: '2025-09-01T14:00:00Z'
  }
];

// ============================================
// MOCK GLOSSARIES
// ============================================

export const MOCK_GLOSSARIES: Glossary[] = [
  {
    id: 'gloss_medical_001',
    user_id: 'user_sub_001',
    name: 'Medical Terms',
    term_count: 250,
    tags: ['medical', 'healthcare', 'hospital'],
    languages: ['all'],
    created_at: '2025-09-25T09:00:00Z',
    updated_at: '2025-09-25T09:00:00Z'
  },
  {
    id: 'gloss_product_001',
    user_id: 'user_sub_001',
    name: 'Product Names',
    term_count: 45,
    tags: ['technical', 'business', 'product'],
    languages: ['all'],
    created_at: '2025-09-10T12:00:00Z',
    updated_at: '2025-10-01T10:00:00Z'
  },
  {
    id: 'gloss_legal_001',
    user_id: 'user_sub_001',
    name: 'Legal Terminology',
    term_count: 180,
    tags: ['legal', 'contracts', 'compliance'],
    languages: ['all'],
    created_at: '2025-08-15T14:00:00Z',
    updated_at: '2025-08-15T14:00:00Z'
  }
];

// ============================================
// MOCK INVOICES
// ============================================

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_2025_10',
    user_id: 'user_payg_001',
    billing_period_start: '2025-10-01',
    billing_period_end: '2025-10-31',
    session_charges: [
      {
        session_id: 'sess_001',
        duration_hours: 2.5,
        rate_per_hour: 75,
        tier_used: 'professional',
        session_date: '2025-10-05',
        charge: 187.50
      },
      {
        session_id: 'sess_002',
        duration_hours: 1.75,
        rate_per_hour: 75,
        tier_used: 'professional',
        session_date: '2025-10-12',
        charge: 131.25
      },
      {
        session_id: 'sess_003',
        duration_hours: 3.0,
        rate_per_hour: 75,
        tier_used: 'professional',
        session_date: '2025-10-20',
        charge: 225.00
      }
    ],
    total_amount: 543.75,
    currency: 'USD',
    status: 'paid',
    paid_at: '2025-10-31T23:59:59Z',
    stripe_invoice_id: 'in_1234567890_oct'
  },
  {
    id: 'inv_2025_09',
    user_id: 'user_payg_001',
    billing_period_start: '2025-09-01',
    billing_period_end: '2025-09-30',
    session_charges: [
      {
        session_id: 'sess_004',
        duration_hours: 1.5,
        rate_per_hour: 75,
        tier_used: 'professional',
        session_date: '2025-09-08',
        charge: 112.50
      },
      {
        session_id: 'sess_005',
        duration_hours: 2.25,
        rate_per_hour: 75,
        tier_used: 'professional',
        session_date: '2025-09-15',
        charge: 168.75
      }
    ],
    total_amount: 281.25,
    currency: 'USD',
    status: 'paid',
    paid_at: '2025-09-30T23:59:59Z',
    stripe_invoice_id: 'in_1234567890_sep'
  },
  {
    id: 'inv_2025_08',
    user_id: 'user_payg_001',
    billing_period_start: '2025-08-01',
    billing_period_end: '2025-08-31',
    session_charges: [
      {
        session_id: 'sess_006',
        duration_hours: 4.0,
        rate_per_hour: 75,
        tier_used: 'professional',
        session_date: '2025-08-22',
        charge: 300.00
      }
    ],
    total_amount: 300.00,
    currency: 'USD',
    status: 'paid',
    paid_at: '2025-08-31T23:59:59Z',
    stripe_invoice_id: 'in_1234567890_aug'
  },
  {
    id: 'inv_2025_07',
    user_id: 'user_payg_001',
    billing_period_start: '2025-07-01',
    billing_period_end: '2025-07-31',
    session_charges: [
      {
        session_id: 'sess_007',
        duration_hours: 0.75,
        rate_per_hour: 45,
        tier_used: 'starter',
        session_date: '2025-07-10',
        charge: 33.75
      },
      {
        session_id: 'sess_008',
        duration_hours: 1.25,
        rate_per_hour: 45,
        tier_used: 'starter',
        session_date: '2025-07-20',
        charge: 56.25
      }
    ],
    total_amount: 90.00,
    currency: 'USD',
    status: 'paid',
    paid_at: '2025-07-10T00:00:00Z',
    stripe_invoice_id: 'in_1234567890_jul'
  }
];

// ============================================
// MOCK ACTIVE SESSION (for participant testing)
// ============================================

export const MOCK_SESSION_ACTIVE: Session = {
  id: 'session_active_001',
  user_id: 'user_payg_001',
  date_time_start: new Date().toISOString(),
  meeting_title: 'Live Team Meeting (Test Mode)',
  meeting_id: 'mock-meeting-123',
  host_name: 'Host User',
  meeting_type: 'business',
  source_language: 'en',
  target_languages: ['es', 'fr', 'de', 'zh'],
  participant_count_total: 12,
  participant_count_viewing: 12,
  tier: 'professional',
  billing_type: 'payg',
  cost: 0,
  status: 'active',
  created_at: new Date().toISOString()
};

// ============================================
// MOCK PARTICIPANTS (for active session)
// ============================================

export const MOCK_PARTICIPANTS: Participant[] = [
  // Spanish speakers (5)
  { id: 'p001', session_id: 'session_active', name: 'John Doe', language_selected: 'es', selected_language: 'es', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:30:00Z' },
  { id: 'p002', session_id: 'session_active', name: 'Maria Garcia', language_selected: 'es', selected_language: 'es', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:31:00Z' },
  { id: 'p003', session_id: 'session_active', name: 'Carlos Lopez', language_selected: 'es', selected_language: 'es', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:32:00Z' },
  { id: 'p004', session_id: 'session_active', name: 'Ana Martinez', language_selected: 'es', selected_language: 'es', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:33:00Z' },
  { id: 'p005', session_id: 'session_active', name: 'Diego Rodriguez', language_selected: 'es', selected_language: 'es', connection_status: 'disconnected', is_viewing: false, joined_at: '2025-10-10T10:34:00Z' },

  // French speakers (4)
  { id: 'p006', session_id: 'session_active', name: 'Jean Dupont', language_selected: 'fr', selected_language: 'fr', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:35:00Z' },
  { id: 'p007', session_id: 'session_active', name: 'Marie Durand', language_selected: 'fr', selected_language: 'fr', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:36:00Z' },
  { id: 'p008', session_id: 'session_active', name: 'Pierre Bernard', language_selected: 'fr', selected_language: 'fr', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:37:00Z' },
  { id: 'p009', session_id: 'session_active', name: 'Sophie Martin', language_selected: 'fr', selected_language: 'fr', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:38:00Z' },

  // German speakers (2)
  { id: 'p010', session_id: 'session_active', name: 'Hans Mueller', language_selected: 'de', selected_language: 'de', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:39:00Z' },
  { id: 'p011', session_id: 'session_active', name: 'Anna Schmidt', language_selected: 'de', selected_language: 'de', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:40:00Z' },

  // Chinese speakers (1)
  { id: 'p012', session_id: 'session_active', name: 'Wei Chen', language_selected: 'zh', selected_language: 'zh', connection_status: 'connected', is_viewing: true, joined_at: '2025-10-10T10:41:00Z' }
];

// ============================================
// MOCK CAPTIONS (for participant view)
// ============================================

export const MOCK_CAPTIONS: Caption[] = [
  {
    id: 'cap_001',
    session_id: 'session_active',
    timestamp: '2025-10-10T10:32:15Z',
    text: 'Bienvenidos a la reunión de hoy. Vamos a discutir los objetivos del trimestre.',
    language: 'es',
    confidence: 0.95,
    is_final: true
  },
  {
    id: 'cap_002',
    session_id: 'session_active',
    timestamp: '2025-10-10T10:32:22Z',
    text: 'El primer punto en nuestra agenda es revisar el rendimiento de ventas del último mes.',
    language: 'es',
    confidence: 0.92,
    is_final: true
  },
  {
    id: 'cap_003',
    session_id: 'session_active',
    timestamp: '2025-10-10T10:32:35Z',
    text: 'Como pueden ver en la diapositiva, hemos superado nuestros objetivos en un 15%.',
    language: 'es',
    confidence: 0.94,
    is_final: true
  },
  {
    id: 'cap_004',
    session_id: 'session_active',
    timestamp: '2025-10-10T10:32:48Z',
    text: 'Esto es gracias al excelente trabajo del equipo de ventas en la región este.',
    language: 'es',
    confidence: 0.93,
    is_final: true
  },
  {
    id: 'cap_005',
    session_id: 'session_active',
    timestamp: '2025-10-10T10:33:05Z',
    text: 'Ahora me gustaría hablar sobre...',
    language: 'es',
    confidence: 0.87,
    is_final: false
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMockUserByType(type: 'payg' | 'payg-no-tier' | 'payg-starter' | 'payg-professional' | 'payg-enterprise' | 'free' | 'trial' | 'free-tier'): User {
  switch (type) {
    case 'payg':
      return MOCK_USER_PAYG_NO_TIER; // Default to PAYG with no tier (tier selection state)
    case 'payg-no-tier':
      return MOCK_USER_PAYG_NO_TIER;
    case 'payg-starter':
      return MOCK_USER_PAYG_STARTER;
    case 'payg-professional':
      return MOCK_USER_PAYG_PROFESSIONAL;
    case 'payg-enterprise':
      return MOCK_USER_PAYG_ENTERPRISE;
    case 'free':
      return MOCK_USER_FREE_ZOOM;
    case 'trial':
    case 'free-tier':
      return MOCK_USER_FREE_TIER; // Both map to new free tier
    default:
      return MOCK_USER_FREE_TIER;
  }
}

export function getMockSessionsByDateRange(startDate: string, endDate: string): Session[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return MOCK_SESSIONS.filter(session => {
    const sessionDate = new Date(session.date_time_start);
    return sessionDate >= start && sessionDate <= end;
  });
}

export function getMockUsageThisMonth(): {
  hours_used: number;
  hours_included: number;
  percentage: number;
  sessions_count: number;
} {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const sessionsThisMonth = MOCK_SESSIONS.filter(session => {
    const sessionDate = new Date(session.date_time_start);
    return sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear;
  });

  const hours_used = sessionsThisMonth.reduce((sum, s) => sum + (s.duration_hours || 0), 0);
  const hours_included = 12; // Professional tier
  const percentage = (hours_used / hours_included) * 100;

  return {
    hours_used,
    hours_included,
    percentage,
    sessions_count: sessionsThisMonth.length
  };
}
