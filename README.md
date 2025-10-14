# MeetingSync Zoom App

Real-time AI translation embedded directly in Zoom meetings. 

## ⚠️ About Mock Data

This project is a **GUI demo** that uses extensive mock data for all live translation, participant, and language features. All mock/demo data is located in the `src/utils/` directory (including language lists, mock sessions, and translation data). **These files are required for the demo to function and should NOT be deleted, even for cloud deployment.**

If you are deploying or sharing this project, ensure that all files in `src/utils/` are included. The mock data enables the demo to simulate real-time translation and multi-language support (including the 24-language listening feature).

## 🏗️ Project Architecture

MeetingSync consists of **two separate web applications** that work together:

### 1. **meetingsync-website** (Sibling Directory)
- **Purpose:** Public marketing site + customer dashboard
- **Access:** Standard web browser at `meetingsync.com`
- **Users:** Prospects, customers managing accounts/settings
- **Features:** Pricing, signup, session management, billing, analytics

### 2. **meetingsync-zoomapp** (This Project)
- **Purpose:** In-meeting translation tool embedded in Zoom
- **Access:** Inside Zoom meetings via "Apps" button
- **Users:** Meeting participants needing real-time translation
- **Features:** Live captions, language selection, translation controls

### Why Two Separate Projects?

1. **Different Deployment Targets**
   - Website: Traditional web hosting (Vercel, Netlify)
   - Zoom App: Embedded iframe within Zoom client

2. **Different Technical Requirements**
   - Website: React Router, marketing pages, full dashboard
   - Zoom App: Zoom Apps SDK, HTTPS required, CORS for `*.zoom.us`

3. **Shared UI Design System**
   - Both use **identical** Tailwind config, colors, and UI components
   - Maintains consistent brand experience across touchpoints

4. **Separate Git Repositories**
   - Independent versioning and deployment cycles
   - Different CI/CD pipelines

### User Journey

1. User visits **meetingsync-website** → Signs up for account
2. User configures session settings in **website dashboard**
3. User joins Zoom meeting → Opens **meetingsync-zoomapp** from Apps menu
4. Translation happens in real-time within the Zoom app
5. User returns to **website** to view analytics and manage billing

---

## 📦 Project Overview

This is the **Zoom App** component of MeetingSync - a lightweight React application that runs inside Zoom meetings using the Zoom Apps SDK.

**⚠️ This directory shares design system files with `meetingsync-website`**

The following files were **copied** from the main website to ensure identical UI/UX:
- `tailwind.config.js` - Complete teal color palette and design tokens
- `src/index.css` - All global styles, typography, glassmorphism
- `src/components/ui/*` - Button, Card, Input, Badge, Modal, Skeleton components

These files should be kept in sync between both projects for visual consistency.

### Technology Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling and HMR
- **Tailwind CSS v4** with shared MeetingSync design system
- **Zoom Apps SDK v0.16.29** for in-meeting integration
- **HTTPS dev server** (required by Zoom)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Zoom account
- Zoom App credentials from [Zoom Marketplace](https://marketplace.zoom.us/)

### Installation

1. **Clone the repository** (or navigate to this directory)

```bash
cd meetingsync-zoomapp
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Zoom App credentials:

```bash
VITE_ZOOM_APP_CLIENT_ID=your_client_id_here
VITE_ZOOM_APP_CLIENT_SECRET=your_client_secret_here
VITE_ZOOM_REDIRECT_URI=https://localhost:5173/auth/callback
```

### Development

Start the development server with HTTPS (required for Zoom Apps SDK):

```bash
npm run dev
```

The app will be available at `https://localhost:5173`

**Important:** You must use HTTPS (not HTTP) for Zoom Apps development. The Vite config includes automatic SSL certificate generation.

### Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Zoom App Configuration

### Creating a Zoom App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click "Develop" → "Build App"
3. Select "Zoom Apps" as the app type
4. Fill in basic information:
   - App Name: **MeetingSync**
   - Short Description: Real-time AI translation
   - App Type: Meeting

5. Configure OAuth settings:
   - Redirect URL: `https://localhost:5173/auth/callback` (dev) or your production URL
   - Add scopes: `zoomapp:inmeeting`

6. Enable required features:
   - In-meeting experience
   - Meeting context APIs

7. Copy your **Client ID** and **Client Secret** to `.env`

### Testing in Zoom

1. Start your dev server: `npm run dev`
2. In Zoom app settings, add `https://localhost:5173` as the development URL
3. Join a Zoom meeting
4. Click "Apps" in the meeting toolbar
5. Find and launch your MeetingSync app

## Project Structure

```
meetingsync-zoomapp/
├── src/
│   ├── components/
│   │   └── ui/              # Shared UI components (Button, Card, Input, etc.)
│   ├── App.tsx              # Main app with Zoom SDK integration
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles + Tailwind
│   └── vite-env.d.ts        # TypeScript environment definitions
├── public/                  # Static assets
├── index.html               # HTML template with Zoom metadata
├── vite.config.ts           # Vite configuration (HTTPS, CORS)
├── tailwind.config.js       # Tailwind theme (shared with main website)
├── package.json
└── README.md
```

## 🎨 Shared Design System

This project shares the **exact same UI theme** as the main MeetingSync website (`meetingsync-website`). The following files are **identical copies** maintained manually:

| File | Purpose | Shared? |
|------|---------|---------|
| `tailwind.config.js` | Teal color palette, spacing, typography, design tokens | ✅ Yes |
| `src/index.css` | Global styles, glassmorphism, dark mode, fluid typography | ✅ Yes |
| `src/components/ui/Button.tsx` | Primary UI button component (5 variants) | ✅ Yes |
| `src/components/ui/Card.tsx` | Card container component (4 variants) | ✅ Yes |
| `src/components/ui/Input.tsx` | Form input with validation | ✅ Yes |
| `src/components/ui/Badge.tsx` | Status badges and labels | ✅ Yes |
| `src/components/ui/Modal.tsx` | Dialog/modal overlay | ✅ Yes |
| `src/components/ui/Skeleton.tsx` | Loading placeholders | ✅ Yes |
| `src/components/ui/index.ts` | Component exports | ✅ Yes |

**Sync Process (Manual):**

When design system changes are made in `meetingsync-website`:

```bash
# From meetingsync-website directory
cp tailwind.config.js ../meetingsync-zoomapp/
cp src/index.css ../meetingsync-zoomapp/src/
cp src/components/ui/* ../meetingsync-zoomapp/src/components/ui/
```

Then test both projects:
```bash
# Test website
cd meetingsync-website && npm run dev

# Test Zoom app
cd ../meetingsync-zoomapp && npm run dev
```

**Why Manual Sync?**
- Projects live in separate git repositories
- Independent deployment cycles
- Full control over when to sync changes
- No npm package overhead for small shared codebase

## Zoom Apps SDK Features

This app uses the Zoom Apps SDK to:

- **Get meeting context** - Access meeting ID, participant info
- **Get user context** - Access current user's display name and role
- **Share app state** - Sync translation settings across participants
- **Send in-meeting notifications** - Alert users to translation events

See [src/App.tsx](src/App.tsx) for SDK initialization and usage examples.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ZOOM_APP_CLIENT_ID` | Your Zoom App Client ID | Yes |
| `VITE_ZOOM_APP_CLIENT_SECRET` | Your Zoom App Client Secret | Yes |
| `VITE_ZOOM_REDIRECT_URI` | OAuth redirect URI | Yes |
| `VITE_API_URL` | Backend API URL (future) | No |
| `VITE_ENV` | Environment (development/production) | No |

## 🚩 Test Mode in Production

To enable the test mode selector and test screens in production (e.g., on Vercel), set the following environment variable:

```
VITE_FORCE_TEST_MODE=true
```

- When this variable is set to `true`, the app will show the test mode selector and allow test/demo flows even in production builds.
- This is useful for QA, demos, or customer previews where you want to bypass the normal Zoom/host/participant logic.
- You can set this in your `.env.production` file or in your Vercel project’s environment variables.

**Warning:**
> Do not leave this variable enabled in production for real users, as it exposes test/demo features intended for development and QA only.

## Troubleshooting

### "Zoom SDK failed to initialize"

- Ensure you're using HTTPS (`https://localhost:5173`)
- Check that your Client ID and Client Secret are correct in `.env`
- Verify the app is enabled in your Zoom account settings
- Check browser console for detailed error messages

### "App not loading in Zoom"

- Confirm the development URL in Zoom Marketplace matches your local server
- Make sure the dev server is running (`npm run dev`)
- Check that your firewall allows connections to localhost:5173
- Try opening the app in a new meeting

### SSL Certificate Warnings

- The dev server uses a self-signed certificate
- Click "Advanced" → "Proceed to localhost" in your browser
- This is normal for local development

## Next Steps

- [ ] Connect to backend API for translation services
- [ ] Implement real-time caption streaming
- [ ] Add language selection UI
- [ ] Integrate with Azure Speech SDK
- [ ] Add meeting recording features
- [ ] Implement participant language preferences

## Related Projects

- **meetingsync-website** - Main marketing/dashboard website (sibling directory)
- **meetingsync-backend** - Backend API (future)

## Resources

- [Zoom Apps SDK Documentation](https://developers.zoom.us/docs/zoom-apps/)
- [Zoom Marketplace](https://marketplace.zoom.us/)
- [MeetingSync Website Repo](../meetingsync-website/)
- [Vite Documentation](https://vitejs.dev/)

## License

Proprietary - MeetingSync © 2025

---

**Need help?** Check the Zoom Apps SDK docs or contact the development team.
