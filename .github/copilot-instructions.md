# Copilot Instructions for MeetingSync Zoom App

## Project Overview
- **Purpose:** Real-time AI translation demo for Zoom meetings, using mock data for all translation/session features.
- **Tech Stack:** React (TypeScript), Vite, Tailwind CSS, Zoom Apps SDK.
- **Design System:** UI components and styles are manually synced with the main `meetingsync-website` project. See `tailwind.config.js`, `src/index.css`, and `src/components/ui/`.

## Architecture & Data Flow
- **App Entry:** `src/App.tsx` orchestrates host/participant flows and initializes Zoom SDK context.
- **Pages:** Full-page components in `src/components/pages/` (e.g., `InvoiceDetailPage`, `SessionDetailPage`).
- **Features:** Tabbed panels in `src/components/features/` (e.g., `TemplatesTab`, `GlossariesTab`).
- **UI Components:** Shared in `src/components/ui/` (e.g., `Button`, `Card`, `Modal`).
- **Mock Data:** All business logic and data come from `src/utils/` (e.g., `mockData.ts`, `mockSessionDetails.ts`).
- **Types:** Centralized in `src/types/index.ts`.
- **Context:** App/session/user/Zoom context in `src/context/`.

## Developer Workflows
- **Install:** `npm install`
- **Dev Server:** `npm run dev` (HTTPS required for Zoom SDK; Vite auto-generates SSL certs)
- **Build:** `npm run build`
- **Lint:** `npx eslint .` (config in `eslint.config.js`)
- **No backend/API:** All data is local and static for demo purposes.

## Key Conventions & Patterns
- **Mock Data:** Never remove files in `src/utils/`; all features depend on these mocks.
- **Dark Mode:** Use Tailwind's `dark:` classes for all UI.
- **Accessibility:** All interactive elements must have ARIA labels and keyboard support.
- **Manual Design Sync:** To update shared UI, copy files from `meetingsync-website` as described in the main `README.md`.
- **Test Modes:** App supports special test/preview flows (see `TestModeSelector` and related screens).
- **Environment:** All Zoom/OAuth config is via `.env` variables prefixed with `VITE_`.

## Integration Points
- **Zoom Apps SDK:** Used for meeting/user context, state sharing, and notifications (see `src/App.tsx`).
- **No real API:** All network/API calls are stubbed or omitted.

## Examples
- **Page usage:**
  ```tsx
  import { InvoiceDetailPage } from './components/pages/InvoiceDetailPage';
  <InvoiceDetailPage invoiceId="inv_2025_10" onBack={...} />
  ```
- **Mock data import:**
  ```ts
  import { MOCK_SESSION_DETAIL } from '../utils/mockSessionDetails';
  ```

## When in Doubt
- Reference the main `README.md` for architecture, workflows, and design sync steps.
- Use existing page/feature components as templates for new work.
- Keep all mock data and UI patterns consistent with the current structure.
