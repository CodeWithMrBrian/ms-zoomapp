// TypeScript interfaces for MeetingSync Zoom App
// Date: October 10, 2025

// ============================================
// USER & BILLING
// ============================================

export type BillingType = 'payg';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise'; // PAYG pricing tiers only
export type ZoomAccountType = 1 | 2 | 3; // 1=Basic, 2=Licensed, 3=Corporate

export interface User {
  id: string;
  name: string;
  email: string;
  zoom_account_type: ZoomAccountType;
  billing_type: BillingType; // Always 'payg' - subscription removed
  subscription_tier?: SubscriptionTier; // PAYG tier (starter/professional/enterprise)
  tier_selected_date?: string; // ISO date string when tier was last selected (for monthly lock-in)
  unpaid_usage?: number; // Current billing period unpaid usage (postpaid PAYG)
  payment_method?: string; // e.g., "Visa ****1234"
  payment_method_added?: boolean; // Whether user has added payment method
  billing_period_start?: string; // Current billing period start date
  billing_period_end?: string; // Current billing period end date (e.g., end of month)
  // Daily Free Tier fields (15 minutes free every day)
  daily_free_minutes_used?: number; // Minutes used today (0-15)
  daily_free_minutes_remaining?: number; // Minutes remaining today (15-0)
  daily_free_reset_date?: string; // ISO date of last reset (YYYY-MM-DD)
  is_free_tier?: boolean; // True if user has no payment method (free tier forever)

  // Free Trial fields
  is_free_trial_active?: boolean; // True if user is in free trial
  free_trial_sessions_remaining?: number; // Sessions left in free trial
  free_trial_sessions_used?: number; // Sessions used in free trial
}

export interface BillingStatus {
  billing_type: BillingType; // Always 'payg'
  tier?: SubscriptionTier; // PAYG tier
  unpaid_usage?: number; // Current billing period unpaid usage (postpaid PAYG)
  payment_method_added?: boolean; // Whether user has added payment method
  // Daily Free Tier status (15 minutes free every day)
  daily_free_minutes_used?: number; // Minutes used today (0-15)
  daily_free_minutes_remaining?: number; // Minutes remaining today (15-0)
  daily_free_reset_date?: string; // ISO date of last reset (YYYY-MM-DD)
  is_free_tier?: boolean; // True if user has no payment method
}

// ============================================
// SESSION & MEETINGS
// ============================================

export type SessionStatus = 'not_started' | 'active' | 'paused' | 'ended';
export type MeetingType = 'general' | 'medical' | 'technical' | 'legal' | 'business' | 'academic' | 'custom';

export interface Session {
  id: string;
  user_id: string;
  date_time_start: string;
  date_time_end?: string;
  duration_hours?: number;
  meeting_title: string;
  meeting_id: string;
  host_name: string;
  meeting_type: MeetingType;
  source_language: string;
  target_languages: string[];
  glossary_id?: string;
  glossary_name?: string;
  participant_count_total: number;
  participant_count_viewing: number;
  tier: SubscriptionTier;
  billing_type: BillingType;
  cost: number;
  status: SessionStatus;
  transcript_url?: string;
  created_at: string;
  // NEW V1 Pricing Fields
  base_cost?: number; // Base tier cost (price_per_hour * duration_hours)
  participant_multiplier_value?: number; // Final multiplier value applied (e.g., 1.25)
  participant_multiplier_data?: ParticipantMultiplier; // Full multiplier calculation details
  overages?: LanguageOverage[]; // Array of overage languages added during session
  overage_cost?: number; // Total cost from all overages
  peak_participant_count?: number; // Highest participant count during session
  // Overage Permission Settings
  allow_language_requests?: boolean; // Host allows participants to request additional languages
  allow_participant_overage?: boolean; // Host allows more than 100 participants
}

// ============================================
// TEMPLATES
// ============================================

export interface Template {
  id: string;
  user_id: string;
  name: string;
  source_language: string;
  target_languages: string[];
  meeting_type: MeetingType;
  glossary_id?: string;
  glossary_name?: string; // Name of associated glossary
  tts_enabled: boolean;
  confidence_threshold: number;
  show_partial_results: boolean;
  host_instructions?: string;
  last_used?: string;
  created_at: string;
  updated_at?: string; // Optional updated timestamp
}

// ============================================
// GLOSSARIES
// ============================================

export interface Glossary {
  id: string;
  user_id: string;
  name: string;
  description?: string; // Optional description for glossary
  term_count: number;
  tags: string[];
  meeting_type_tags?: string[]; // Tags for meeting types this glossary is used for
  languages: string[];
  created_at: string;
  updated_at: string;
}

// ============================================
// LANGUAGES
// ============================================

export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag: string;
  tier_required: SubscriptionTier;
}

// ============================================
// PRICING TIERS
// ============================================

export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price_per_hour: number;
  translation_limit: number; // NEW: Number of translations (target languages only, not including source)
  total_language_limit: number; // NEW: Total languages including source (translation_limit + 1)
  overage_rate_per_hour: number; // NEW: Cost per additional language per hour
  features: string[];
  ideal_for: string[];
}

// ============================================
// OVERAGE TRACKING (V1 Pricing)
// ============================================

export interface LanguageOverage {
  language_code: string; // Language code (e.g., 'es', 'fr')
  added_at_minutes: number; // Session time when language was added (in minutes from session start)
  removed_at_minutes?: number; // Session time when language was removed (undefined if still active)
  overage_rate: number; // Rate per hour for this overage language at time of addition
  calculated_cost: number; // Total cost for this overage (updated when removed or session ends)
}

export interface ParticipantMultiplier {
  participant_count: number; // Current participant count
  multiplier: number; // Calculated multiplier value (e.g., 1.0, 1.25, 1.5)
  base_threshold: number; // Base threshold (100 participants)
  increment_threshold: number; // Increment per threshold (100 participants)
  increment_rate: number; // Rate increase per increment (0.25)
}

// ============================================
// INVOICES
// ============================================

export interface Invoice {
  id: string;
  user_id: string;
  billing_period_start: string;
  billing_period_end: string;
  session_charges: Array<{
    session_id: string;
    duration_hours: number;
    rate_per_hour: number;
    tier_used: string;
    session_date: string;
    charge: number;
  }>;
  total_amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  paid_at?: string;
  stripe_invoice_id?: string;
}

// ============================================
// PARTICIPANTS
// ============================================

export interface Participant {
  id: string;
  session_id: string;
  name: string;
  language_selected: string;
  selected_language: string; // Alias for language_selected (backward compatibility)
  connection_status: 'connected' | 'disconnected';
  is_viewing: boolean; // Whether participant is currently viewing captions
  joined_at: string;
}

// ============================================
// CAPTIONS
// ============================================

export interface Caption {
  id: string;
  session_id: string;
  timestamp: string;
  text: string;
  language: string;
  confidence: number;
  is_final: boolean;
  speaker_name?: string; // Name of the person speaking (for speaker identification)
}

// ============================================
// ZOOM SDK TYPES
// ============================================

export interface ZoomMeetingContext {
  meetingID: string;
  meetingTopic?: string;
  meetingUUID?: string;
}

export interface ZoomUserContext {
  screenName: string;
  role: 'host' | 'attendee' | 'coHost';
  participantID: string;
}

export interface ZoomConfig {
  capabilities: string[];
  version: string;
  popoutSize?: {
    width: number;
    height: number;
  };
}

// ============================================
// APP STATE
// ============================================

export type UserRole = 'host' | 'participant';
export type AppScreen =
  | 'host_setup'
  | 'host_active'
  | 'host_settings'
  | 'participant_language_select'
  | 'participant_caption_view'
  | 'participant_error'
  | 'tier_selection_modal'
  | 'usage_warning_modal';

export interface AppState {
  current_screen: AppScreen;
  user_role: UserRole;
  session_status: SessionStatus;
  is_loading: boolean;
  error?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface HostSetupForm {
  template_id?: string;
  meeting_type: MeetingType;
  source_language: string;
  target_languages: string[];
  tier?: SubscriptionTier; // Only for PAYG users
  glossary_id?: string;
  tts_enabled: boolean;
  confidence_threshold: number;
  show_partial_results: boolean;
  host_instructions?: string;
}

export interface PreferencesForm {
  default_source_language: string;
  favorite_target_languages: string[];
  auto_export_transcript: boolean;
  notification_email: string;
  enable_tts_by_default: boolean;
  email_usage_warnings: boolean;
  email_monthly_summary: boolean;
  email_product_updates: boolean;
}

// ============================================
// API RESPONSE TYPES (for future backend integration)
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
