# Modals Components

This directory contains modal dialog components for the MeetingSync Zoom App.

## Available Modals

### ExportDataModal
**File:** `ExportDataModal.tsx`

A multi-step modal for exporting user data with configuration options.

**Usage:**
```tsx
import { useState } from 'react';
import { ExportDataModal } from './components/modals/ExportDataModal';

function MyComponent() {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowExportModal(true)}>
        Export Data
      </button>

      <ExportDataModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
}
```

**Features:**

**Step 1: Select Data Type**
- Session History (meeting sessions with dates, durations, participants)
- Full Transcripts (complete transcripts with translations)
- Billing & Invoices (billing history and payment records)

**Step 2: Configure Export**
- Date range picker (From/To dates)
- Format selection (CSV, PDF, Excel)

**Step 3: Confirmation**
- Review summary of selections
- Email delivery option (for large exports)
- Export button with loading state

**Progress Indicator:**
- Shows current step visually
- 3 steps: "Select Data", "Configure", "Export"

**Navigation:**
- Back button (steps 2-3)
- Next button (steps 1-2) with validation
- Cancel button (all steps)
- Export button (step 3) with loading state

---

## Modal Features

All modals in this directory include:
- **Modal overlay** with click-outside-to-close
- **Close button** in header (X icon)
- **Toast notifications** for success/error feedback
- **Loading states** for async operations
- **Validation** prevents invalid form submissions
- **Dark mode support** via Tailwind
- **Responsive sizing** (sm/md/lg)
- **Accessibility** with proper ARIA attributes

## Design System

Modals follow the MeetingSync design system:
- **Background overlay:** Semi-transparent dark layer
- **Modal container:** White (light) / Gray-800 (dark)
- **Rounded corners:** rounded-lg
- **Shadow:** shadow-xl
- **Button styles:** Primary (teal), outline, destructive
- **Progress indicator:** Teal accents for active steps

## State Management

The ExportDataModal manages its own internal state:
- `currentStep`: Tracks which step user is on (1-3)
- `dataType`: Selected data type (sessions/transcripts/invoices)
- `dateFrom/dateTo`: Date range selection
- `format`: Export format (csv/pdf/excel)
- `emailDelivery`: Boolean for email notification preference
- `isExporting`: Loading state during export

## Integration Tips

### 1. Replace Mock Export with Real API

```tsx
const handleExport = async () => {
  setIsExporting(true);

  try {
    const response = await fetch('/api/export', {
      method: 'POST',
      body: JSON.stringify({
        dataType,
        dateFrom,
        dateTo,
        format,
        emailDelivery
      })
    });

    if (!response.ok) throw new Error('Export failed');

    if (emailDelivery) {
      showToast('Export started. Check your email.', 'success');
    } else {
      const blob = await response.blob();
      downloadFile(blob, `export-${dataType}.${format}`);
      showToast('Export downloaded successfully!', 'success');
    }
  } catch (error) {
    showToast('Export failed. Please try again.', 'error');
  } finally {
    setIsExporting(false);
    handleClose();
  }
};
```

### 2. Add Analytics Tracking

```tsx
const handleExport = async () => {
  // Track export action
  analytics.track('Data Export Started', {
    dataType,
    format,
    dateRange: { from: dateFrom, to: dateTo },
    emailDelivery
  });

  // ... export logic
};
```

### 3. Add Custom Validation

```tsx
const canProceedToStep3 = useMemo(() => {
  if (!dateFrom || !dateTo || !format) return false;

  // Validate date range
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  if (to < from) return false;

  // Validate maximum range (e.g., 1 year)
  const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in ms
  if (to.getTime() - from.getTime() > maxRange) return false;

  return true;
}, [dateFrom, dateTo, format]);
```

## Testing

Example test cases for ExportDataModal:

```tsx
describe('ExportDataModal', () => {
  it('should render with step 1 by default', () => {
    render(<ExportDataModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('What would you like to export?')).toBeInTheDocument();
  });

  it('should not allow Next if no data type selected', () => {
    render(<ExportDataModal isOpen={true} onClose={() => {}} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should progress through all steps', () => {
    // ... test step progression
  });

  it('should show success toast on export', async () => {
    // ... test export success
  });
});
```

## Future Enhancements

Potential improvements for this modal:
- [ ] Add preview of data before export
- [ ] Support for custom date presets (Last 7 days, Last month, etc.)
- [ ] Export scheduling (recurring exports)
- [ ] Compression options for large files
- [ ] Column/field selection for CSV exports
- [ ] Multi-language export support
