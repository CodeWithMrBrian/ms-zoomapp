# Major Business Decisions for MeetingSync Zoom App

This document summarizes the major business decisions, extracted from the codebase, that must be made for the MeetingSync Zoom App. These decisions are grouped by category and include current logic, open questions, and options to consider.

---

## 1. Pricing & Tiers

### Free Tier
- **Daily Minutes:** 15 minutes per day (resets at midnight UTC)
- **Language Limits:** 2 translations (3 total languages: 1 source + 2 target)
- **Features:**
  - No credit card required
  - No participant limits during free usage
  - All core translation features
- **Eligibility:** Only for Zoom Pro, Business, and Enterprise accounts
- **Upgrade Path:** Users can upgrade anytime to PAYG for unlimited usage
- **Open Questions:**
  - Should TTS (Text-to-Speech) be allowed on the free tier?
  - Should the daily minutes or language limits be adjusted?

### PAYG (Pay-As-You-Go)
- **Model:** Postpaid (usage accumulates, billed at end of month)
- **Tiers:**
  - **Starter:** $45/hr, 1 translation (2 total languages), $10/hr per extra language, up to 100 participants (then +25% per 100 more)
  - **Professional:** (Details in config, similar structure)
  - **Enterprise:** (Details in config, similar structure)
- **Features:**
  - Meeting recording
  - PDF transcript export
  - Email support
- **Open Questions:**
  - Should additional tiers or custom plans be offered?
  - Should there be a prepaid hours option (like Wordly)?

### Subscription
- **Current State:** No explicit subscription (monthly/yearly) logic found in codebase.
- **Open Questions:**
  - Should a subscription model be introduced?
  - What would be the pricing and features for subscription?

### Prepaid Hours
- **Current State:** No explicit logic for prepurchase of hours found.
- **Open Questions:**
  - Should users be able to prepurchase hours?
  - How would this interact with PAYG and free tiers?

---

## 2. Payment Systems
- **Current Logic:**
  - Mock payment methods (credit cards) are used for testing.
  - Postpaid billing for PAYG (no upfront charge, billed at end of month).
- **Open Questions:**
  - Should the app use Zoom's payment system or a custom payment system?
  - Should other payment methods (PayPal, ACH, etc.) be supported?

---

## 3. Authentication & User Management
- **Current Logic:**
  - Zoom SSO is used for authentication (via ZoomContext and useZoomSDK).
  - No evidence of a custom login system.
- **Open Questions:**
  - Should users be able to create accounts outside of Zoom SSO?
  - Should there be admin or team management features?

---

## 4. Session & Tier Flexibility
- **Tier Change Policy:**
  - Users can only change their tier on the 1st of each month (monthly lock-in).
- **Free Tier Reset:**
  - Free tier minutes reset daily at midnight UTC.
- **Session Config:**
  - Allows toggling TTS, language requests, participant overage, etc.
- **Open Questions:**
  - Should tier changes be allowed more frequently?
  - Should session-level overrides be allowed for features or limits?

---

## 5. Feature Access by Tier
- **Configurable Features:**
  - TTS (Text-to-Speech)
  - Language limits
  - Minutes per day
  - Participant scaling (base threshold, increment size, multiplier rate)
- **Open Questions:**
  - Should certain features be exclusive to higher tiers?
  - Should there be add-ons for extra features?

---

## 6. Other Notable Business Logic
- **Participant Scaling:**
  - Pricing increases by 25% per 100 participants above the base threshold (starter tier example).
- **Competitor Comparison:**
  - Config includes competitor pricing and feature comparison (for internal use).
- **Open Questions:**
  - Should competitor pricing be used to inform dynamic pricing?
  - Should there be a public-facing comparison?

---

## Summary of Open Decisions
- Free tier feature set (TTS, limits)
- Subscription and prepaid hour options
- Payment system integration (Zoom vs. custom)
- Authentication options (Zoom SSO vs. custom)
- Tier change and session flexibility
- Feature access and add-ons by tier
- Competitor comparison strategy

---

_This document should be updated as business logic evolves or new features are added._
