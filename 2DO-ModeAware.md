# Mode-Aware Initial Page Proposal for MeetingSync Zoom App

## Overview
This proposal describes how to make the initial page and navigation of the MeetingSync Zoom App context-aware, supporting both "Meeting Mode" (inside a live Zoom meeting) and "Home Mode" (from the Zoom home, no meeting in progress).

---

## 1. Mode Detection & Context
- Detect if the app is running inside a live Zoom meeting or from the Zoom home (no meeting).
- Use Zoom Apps SDK context (already in use in `App.tsx` and `ZoomContext.tsx`).
- If meeting context is present: "Meeting Mode".
- If not: "Home Mode".

## 2. Feature Gating by Mode
- **Meeting Mode** (inside a live meeting):
  - Host: Can start/end translation sessions, manage live features.
  - Participants: Can join sessions, see live translation.
  - Host can still access settings, payment, glossary, etc.
- **Home Mode** (from Zoom home, no meeting):
  - Host: Can manage payment, settings, glossaries, templates, etc.
  - No translation session controls (start/end session, join session) shown.

## 3. UI/UX Adjustments
- **Left Pane (Sidebar):**
  - Visually distinguish modes (e.g., different background color or accent for "Home Mode").
  - Show/hide navigation items based on mode (e.g., hide "Start Session" in Home Mode).
- **Initial Page Selection:**
  - In "Meeting Mode": Default to "Session" or "Live Translation" page.
  - In "Home Mode": Default to "Settings" or "Dashboard" page.

## 4. Implementation Steps
1. Update `ZoomContext` to expose a `mode` property: "meeting" or "home".
2. In `App.tsx`, determine mode at startup and pass to context.
3. Adjust sidebar (`SidebarLayout` or similar) to:
   - Change background color/style based on mode.
   - Conditionally render navigation items.
4. Update routing/initial page logic in `App.tsx` to select the correct landing page per mode.
5. Gate features/components (e.g., session controls) based on mode.
6. (Optional) Add a mode indicator (e.g., "Meeting Mode"/"Home Mode" badge) for clarity.

## 5. Mock Data & Testability
- Since all data is mocked, you can simulate both modes for testing.
- Add a "Test Mode Selector" (if not already present) to toggle between modes for local dev/demo.

---

## Initial Page Selection Details

### Meeting Mode (inside a live Zoom meeting)
- The initial page will skip the “start from the beginning” and “test specific page” options.
- Instead, it will directly show the main meeting-related page:
  - For hosts: the “Session” or “Live Translation” page, where they can start/end translation sessions.
  - For participants: the page to join/view a translation session.

### Home Mode (from Zoom home, no meeting)
- The initial page will also skip the test/demo selection.
- It will show a dashboard or settings page relevant to the host:
  - For example, “Account”, “Settings”, or “Glossaries” page.
  - Optionally, a “Welcome” or “Dashboard” page summarizing available actions (manage payment, glossaries, etc.).

### Test/Preview Mode (for local development)
- If you want to keep the “start from the beginning” and “test specific page” options for development, you can show these only when running in a special test mode (e.g., via a “Test Mode Selector”).
- In production or real Zoom contexts, these options would be hidden.

---

## Summary
The new initial page will be context-sensitive, showing the most relevant main page for the detected mode, and only showing test/demo options in explicit test/dev scenarios.