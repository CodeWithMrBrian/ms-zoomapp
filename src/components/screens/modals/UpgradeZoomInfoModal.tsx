import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export interface UpgradeZoomInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshStatus: () => void;
  onSeePAYGPlans: () => void;
}

/**
 * UpgradeZoomInfoModal - Explains Zoom Pro requirement for free trial
 *
 * Shown when free Zoom Basic users try to claim free trial.
 * Provides two options: upgrade Zoom account or start with PAYG.
 */
export function UpgradeZoomInfoModal({
  isOpen,
  onClose,
  onRefreshStatus,
  onSeePAYGPlans
}: UpgradeZoomInfoModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);

    // Simulate account status check
    setTimeout(() => {
      onRefreshStatus();
      setIsRefreshing(false);
    }, 1500);
  };

  const handleUpgradeZoom = () => {
    window.open('https://zoom.us/pricing', '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Zoom Pro Required"
      size="md"
    >
      <div className="space-y-6">
        {/* Info Message */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Free Trial Requires Paid Zoom Account
          </p>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            To prevent abuse, our daily free tier (15 min/day forever) is only available for Zoom Pro, Business, or Enterprise accounts.
          </p>
        </div>

        {/* Why This Requirement */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Why this requirement?
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Zoom Pro accounts have verified payment information with Zoom, which helps us prevent trial abuse while keeping our service accessible to legitimate users.
          </p>
        </div>

        {/* Option 1: Upgrade Zoom */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-teal-500 dark:border-teal-600">
          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">1.</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Upgrade Your Zoom Account
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Upgrade to Zoom Pro ($149/year) for unlimited 40+ hour meetings, then return to claim your MeetingSync daily free tier.
              </p>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpgradeZoom}
                  className="w-full"
                >
                  Upgrade Zoom Account
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefreshStatus}
                  className="w-full"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking Status...</span>
                    </div>
                  ) : (
                    'Refresh Account Status'
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                After upgrading, click "Refresh Account Status" to unlock daily free tier
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Skip Trial, Use PAYG */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Skip Daily Free Tier - Start with Pay-As-You-Go
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Skip the daily free tier and start with our flexible pay-as-you-go plans. No Zoom upgrade needed.
              </p>
              <div className="space-y-2 text-xs mb-3">
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
              <Button
                variant="secondary"
                size="sm"
                onClick={onSeePAYGPlans}
                className="w-full"
              >
                See MeetingSync Plans
              </Button>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Need Help?
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            Our support team can help you navigate upgrade options and answer questions about eligibility.
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Email:</strong>{' '}
            <a href="mailto:support@meetingsync.com" className="underline hover:no-underline">
              support@meetingsync.com
            </a>
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
