# Pages Components

This directory contains full-page components for the MeetingSync Zoom App.

## Available Pages

### 1. InvoiceDetailPage
**File:** `InvoiceDetailPage.tsx`

Displays detailed invoice information with line items, totals, and download options.

**Usage:**
```tsx
import { InvoiceDetailPage } from './components/pages/InvoiceDetailPage';

<InvoiceDetailPage
  invoiceId="inv_2025_10"
  onBack={() => navigateToAccount()}
/>
```

**Features:**
- Invoice metadata (number, date, status)
- Line items table with hours and rates
- Subtotal, tax, and total calculations
- Download PDF button (mockup)
- Email invoice button (mockup)
- Payment method and billing address display

---

### 2. PaymentMethodsPage
**File:** `PaymentMethodsPage.tsx`

Manages user's payment methods (credit cards) with full CRUD operations.

**Usage:**
```tsx
import { PaymentMethodsPage } from './components/pages/PaymentMethodsPage';

<PaymentMethodsPage
  onBack={() => navigateToAccount()}
/>
```

**Features:**
- List of payment methods with card brand icons
- "Default" badge indicator
- Set as Default functionality
- Delete with confirmation modal
- Add new card button (mockup)
- Empty state when no cards exist
- Security notice

---

### 3. SessionDetailPage
**File:** `SessionDetailPage.tsx`

Shows comprehensive session details including transcript, participants, and metrics.

**Usage:**
```tsx
import { SessionDetailPage } from './components/pages/SessionDetailPage';

<SessionDetailPage
  sessionId="session_001"
  onBack={() => navigateToActivity()}
/>
```

**Features:**
- Meeting metadata (title, host, date, duration)
- Key metrics cards (messages, confidence, languages, participants)
- Full transcript with speaker names and timestamps
- Language selector for viewing translations
- Confidence badges (High/Good/Medium/Low)
- Participants list with duration and language
- Download recording button (mockup)
- Download transcript with format selector (TXT/SRT/VTT)

---

## Mock Data Sources

All pages use mock data from the `src/utils/` directory:

- **InvoiceDetailPage:** `MOCK_INVOICES` from `mockData.ts`
- **PaymentMethodsPage:** `MOCK_PAYMENT_METHODS` from `mockPaymentMethods.ts`
- **SessionDetailPage:** `MOCK_SESSION_DETAIL` from `mockSessionDetails.ts`

## Shared Features

All pages include:
- **Breadcrumbs navigation** for context
- **Back button** with onBack callback
- **Toast notifications** for user feedback
- **Dark mode support** via Tailwind dark: classes
- **Responsive layouts** for mobile/tablet/desktop
- **TypeScript** with full type safety
- **Accessibility** with ARIA labels and keyboard navigation

## Design System

All pages follow the MeetingSync design system:
- **Primary color:** Teal (teal-600)
- **Card components** with hover effects
- **Button variants:** primary, secondary, outline, destructive
- **Badge variants:** success, error, warning, info, neutral
- **Typography:** Clear hierarchy with proper heading sizes

## Integration Example

```tsx
import { useState } from 'react';
import { InvoiceDetailPage } from './components/pages/InvoiceDetailPage';
import { PaymentMethodsPage } from './components/pages/PaymentMethodsPage';
import { SessionDetailPage } from './components/pages/SessionDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'invoice' | 'payment' | 'session'>('home');

  return (
    <div>
      {currentPage === 'home' && (
        <div>
          <button onClick={() => setCurrentPage('invoice')}>View Invoice</button>
          <button onClick={() => setCurrentPage('payment')}>Manage Payments</button>
          <button onClick={() => setCurrentPage('session')}>View Session</button>
        </div>
      )}

      {currentPage === 'invoice' && (
        <InvoiceDetailPage onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'payment' && (
        <PaymentMethodsPage onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'session' && (
        <SessionDetailPage onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
}
```

## Next Steps

To integrate these pages into the main application:

1. Add routing logic (or conditional rendering)
2. Replace mock data with real API calls
3. Wire up navigation handlers
4. Add analytics tracking
5. Test all user flows
