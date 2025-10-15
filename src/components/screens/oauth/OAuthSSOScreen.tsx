import { useState } from 'react';
import { Button, Card } from '../../ui';
import { SidebarCompactLayout } from '../../ui/SidebarLayout';

export interface OAuthSSOScreenProps {
  onSignIn: () => void;
}

/**
 * OAuth/SSO Screen - Simulates Zoom SSO authorization
 *
 * This screen appears in the "full journey" test mode flow.
 * In production, this would redirect to Zoom's OAuth authorization page.
 */
export function OAuthSSOScreen({ onSignIn }: OAuthSSOScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleSignIn = () => {
    if (!isAuthorized) return;

    setIsAuthenticating(true);

    // Simulate OAuth delay (1-2 seconds)
    setTimeout(() => {
      onSignIn();
    }, 1500);
  };

  return (
    <SidebarCompactLayout 
      className="min-h-full flex items-start justify-center bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-4"
      pageTitle="Connect to Zoom"
    >
      <Card variant="beautiful" className="max-w-md w-full">
        <div className="text-center space-y-6 p-8">
          {/* Zoom Logo Placeholder */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 8v8c0 1.1.9 2 2 2h12l4 4V8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2zm18-2v12l-4-4H4V6h16z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Connect to Zoom
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in with your Zoom account to continue
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              MeetingSync will access your Zoom account to provide real-time translation in your meetings.
            </p>
          </div>

          {/* Permissions List */}
          <div className="text-left space-y-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
              This app will be able to:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Access your Zoom meetings</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>View meeting participants</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Provide translation services</span>
              </div>
            </div>
          </div>

          {/* Authorization Checkbox */}
          <div className="text-left pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                I authorize MeetingSync to access my Zoom account and provide translation services
              </span>
            </label>
          </div>

          {/* Sign In Button */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSignIn}
              disabled={isAuthenticating || !isAuthorized}
              className="w-full"
            >
              {isAuthenticating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In with Zoom SSO'
              )}
            </Button>

            {/* Test Mode Notice */}
            {import.meta.env.DEV && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Test Mode: This simulates Zoom OAuth authorization
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to MeetingSync's{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </Card>
    </SidebarCompactLayout>
  );
}
