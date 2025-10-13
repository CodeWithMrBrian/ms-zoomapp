import { useState } from 'react';
import { Button, Card } from '../../ui';
import { UpgradeZoomInfoModal } from '../modals/UpgradeZoomInfoModal';

export interface WelcomeScreenProps {
  userName: string;
  isPaidZoom: boolean;
  onStartFreeTier: () => void;
  onSeePlans: () => void;
  onSkip?: () => void;
  onCancel?: () => void;
}

/**
 * Welcome Screen - First screen after OAuth authorization
 *
 * Shows different messaging based on Zoom account type:
 * - Paid Zoom (Type 2/3): Daily free tier available (15 min/day forever)
 * - Free Zoom (Type 1): Upgrade required
 */
export function WelcomeScreen({
  userName,
  isPaidZoom,
  onStartFreeTier,
  onSeePlans,
  onSkip,
  onCancel
}: WelcomeScreenProps) {
  if (!isPaidZoom) {
    return <UpgradeRequiredScreen userName={userName} onSeePlans={onSeePlans} onCancel={onCancel} />;
  }

  return (
    <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card variant="beautiful" className="max-w-md w-full">
        <div className="text-center space-y-6 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">MS</span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              You're In, {userName}!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your Zoom account is successfully connected to MeetingSync.
            </p>
          </div>

          {/* Daily Free Tier Section */}
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Start with Daily Free Tier
              </h2>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <span className="font-semibold text-teal-600 dark:text-teal-400">15 Minutes Free Every Day • Forever</span>
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Don't let language barriers limit your meetings. Experience real-time AI translation with:
            </p>

            <ul className="text-sm text-left space-y-2 mb-4">
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                <span>15 minutes free every day (ongoing)</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                <span>2 translations (3 total languages) per session</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                <span>No credit card required</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                <span>Resets daily at midnight</span>
              </li>
            </ul>
          </div>

          {/* Paid Options Preview */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Want unlimited sessions?
            </p>

            <div className="space-y-2 text-xs text-left">
              <div className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Starter:</span>
                  <span className="text-gray-600 dark:text-gray-400"> $45/hour - 1 translation (2 total languages)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Professional:</span>
                  <span className="text-gray-600 dark:text-gray-400"> $75/hour - 5 translations (6 total languages)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Enterprise:</span>
                  <span className="text-gray-600 dark:text-gray-400"> $105/hour - 15 translations (16 total languages)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-3">
              30-70% cheaper than Wordly - No monthly commitment!
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartFreeTier}
              className="w-full"
            >
              Start with Daily Free Tier
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onSeePlans}
              className="w-full"
            >
              See Pricing Plans
            </Button>

            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Skip - Just Browse
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Upgrade Required Screen - Shown to Free Zoom Basic users (Type 1)
 */
interface UpgradeRequiredScreenProps {
  userName: string;
  onSeePlans: () => void;
  onCancel?: () => void;
}

function UpgradeRequiredScreen({ userName, onSeePlans, onCancel }: UpgradeRequiredScreenProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleRefreshStatus = () => {
    setShowUpgradeModal(false);
    alert('Account status refreshed! If you upgraded, your free trial is now available.');
    // In production, this would re-fetch user data from backend
  };

  return (
    <>
      <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card variant="beautiful" className="max-w-md w-full">
        <div className="text-center space-y-6 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">MS</span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome, {userName}!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your Zoom account is now connected.
            </p>
          </div>

          {/* Warning Section */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Daily Free Tier Requires Paid Zoom
              </h2>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              To prevent abuse, our daily free tier is only available for Zoom Pro, Business, or Enterprise accounts.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              You have 2 options:
            </p>

            {/* Option 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">1.</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Upgrade Your Zoom Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Upgrade to Zoom Pro ($149/year) then return to unlock daily free tier
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full"
                  >
                    Learn More →
                  </Button>
                </div>
              </div>
            </div>

            {/* Option 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Start with MeetingSync PAYG Plan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Skip the daily free tier and start with a pay-as-you-go plan
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onSeePlans}
                    className="w-full"
                  >
                    See MeetingSync Plans →
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Maybe Later
            </button>
          )}
        </div>
      </Card>
      </div>

      {/* Upgrade Modal */}
      <UpgradeZoomInfoModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onRefreshStatus={handleRefreshStatus}
        onSeePAYGPlans={onSeePlans}
      />
    </>
  );
}
