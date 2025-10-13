import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { NavigationHeader } from '../../ui/NavigationHeader';
import { useSession } from '../../../context/SessionContext';
import { useUser } from '../../../context/UserContext';
import { LANGUAGES, PRICING_TIERS, formatCurrency, getLanguageDisplayName } from '../../../utils/constants';

/**
 * SessionSummary Screen - Shown after host ends a session
 *
 * Features:
 * - Session duration and cost/usage summary
 * - Languages used and participant breakdown
 * - Download transcript button
 * - View detailed analytics link
 * - Start new session or return to dashboard
 */

interface SessionSummaryProps {
  onStartNewSession: () => void;
  onReturnToDashboard: () => void;
  onOpenTierModal: () => void;
}

export function SessionSummary({ onStartNewSession, onReturnToDashboard, onOpenTierModal }: SessionSummaryProps) {
  const { session, duration, cost } = useSession();
  const { user, isPAYG, isDailyFreeTier, dailyMinutesRemaining } = useUser();

  // FIX #4: Use getLanguageDisplayName helper to return string (not Language object)
  const getLanguageName = (code: string) => {
    return getLanguageDisplayName(code);
  };

  // Format duration for display
  const formatDurationDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleDownloadTranscript = () => {
    // In production, this would download the actual PDF transcript
    alert('PDF transcript download will be available in production. Session ID: ' + session?.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Navigation Header */}
      <NavigationHeader
        title="Session Complete"
        onBack={onReturnToDashboard}
        backLabel="Dashboard"
      />

      {/* Success Message */}
      <Card variant="default" padding="lg">
        <CardContent>
          <div className="text-center space-y-4 py-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Translation Session Ended
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your meeting translation has been saved and processed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Session Details */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Duration */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDurationDisplay(duration)}
              </span>
            </div>

            {/* Cost / Usage */}
            {isPAYG && !isDailyFreeTier ? (
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Cost
                </span>
                <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                  ${cost.toFixed(2)}
                </span>
              </div>
            ) : isDailyFreeTier ? (
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minutes Remaining Today
                </span>
                <Badge variant={dailyMinutesRemaining > 5 ? 'success' : dailyMinutesRemaining > 0 ? 'warning' : 'error'}>
                  {dailyMinutesRemaining} of 15
                </Badge>
              </div>
            ) : null}

            {/* Source Language */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Source Language
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getLanguageName(session?.source_language || 'en')}
              </span>
            </div>

            {/* Target Languages */}
            <div className="py-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">
                Target Languages
              </span>
              <div className="flex flex-wrap gap-2">
                {session?.target_languages.map((langCode) => (
                  <Badge key={langCode} variant="neutral">
                    {getLanguageName(langCode)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meeting Type */}
            {session?.meeting_type && session.meeting_type !== 'general' && (
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meeting Type
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {session.meeting_type}
                </span>
              </div>
            )}

            {/* Meeting Title */}
            {session?.meeting_title && (
              <div className="py-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Meeting Title
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {session.meeting_title}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions - Fixed hierarchy: 1 primary, 2 secondary */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Primary Action: Start New Session */}
            <Button
              variant="primary"
              size="lg"
              onClick={onStartNewSession}
              disabled={isDailyFreeTier && dailyMinutesRemaining === 0}
              className="w-full"
              title={
                isDailyFreeTier && dailyMinutesRemaining === 0
                  ? "No free minutes remaining today - Upgrade to PAYG or come back tomorrow"
                  : undefined
              }
            >
              {isDailyFreeTier && dailyMinutesRemaining === 0
                ? "No Minutes Remaining - Upgrade to PAYG"
                : "Start New Session"
              }
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleDownloadTranscript}
                className="w-full"
              >
                Download Transcript
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={onReturnToDashboard}
                className="w-full"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Billing Period Usage (PAYG with payment method) */}
      {isPAYG && user && user.payment_method_added && !user.is_free_trial_active && (
        <Card variant="default" padding="lg">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Usage This Month
                </p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">
                  ${(user.unpaid_usage || 0).toFixed(2)}
                </p>
                {user.billing_period_start && user.billing_period_end && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Billing period: {user.billing_period_start} to {user.billing_period_end}
                  </p>
                )}
              </div>
              {(user.unpaid_usage || 0) > 150 && (
                <Badge variant="warning">High Usage</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isDailyFreeTier && dailyMinutesRemaining === 0 && (
        <Card variant="beautiful" padding="lg">
          <CardContent>
            <div className="text-center space-y-4">
              {/* Clock Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-2">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Daily Free Tier: No Minutes Remaining
              </h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                You've used your 15 free minutes today. Come back tomorrow for another 15 minutes, or upgrade now for unlimited usage!
              </p>

              {/* Pricing Highlight */}
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4 mt-6">
                <p className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-2">
                  Upgrade to Pay-As-You-Go for Unlimited Usage
                </p>
                <div className="space-y-1 text-sm text-teal-800 dark:text-teal-200">
                  <p>Starter: $45/hour (3 languages)</p>
                  <p>Professional: $75/hour (7 languages)</p>
                  <p>Enterprise: $95/hour (ALL languages)</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 justify-center pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenTierModal}
                >
                  Upgrade to PAYG
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onReturnToDashboard}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
