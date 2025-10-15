// React import not needed for component
import { Button, Card, Badge } from '../../ui';
import { SidebarCompactLayout } from '../../ui/SidebarLayout';
import { PRICING_TIERS } from '../../../utils/constants';
import { pricingConfig } from '../../../utils/pricingManager';

export interface FreeTrialActivatedScreenProps {
  onStartSession: () => void;
  onComparePlans: () => void;
}

/**
 * Free Tier Activated Screen
 *
 * Shown immediately after user clicks "Start with Daily Free Tier" on Welcome Screen
 * Explains how daily free tier works and provides CTAs
 */
export function FreeTrialActivatedScreen({
  onStartSession,
  onComparePlans
}: FreeTrialActivatedScreenProps) {
  return (
    <SidebarCompactLayout 
      className="min-h-full flex items-start justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-4"
      pageTitle="Daily Free Tier Activated"
    >
      <Card variant="beautiful" className="max-w-lg w-full">
        <div className="text-center space-y-6 p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Daily Free Tier Activated!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You're all set to start translating meetings
            </p>
          </div>

          {/* Free Tier Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              You now have:
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily allowance</span>
                <Badge variant="success">{`${pricingConfig.getFreeTierMinutes()} minutes/day`}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Resets</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Daily at midnight
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Languages</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {`${pricingConfig.getFreeTierLanguageLimits().translations} translation (${pricingConfig.getFreeTierLanguageLimits().total} total)`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Forever
                </span>
              </div>
            </div>
          </div>

          {/* What To Do When You Run Out */}
          <div className="text-left space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">
                Need More Minutes?
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you run out, upgrade to Pay-As-You-Go for unlimited usage:
            </p>

            {/* PAYG Tiers */}
            <div className="space-y-2">
              {/* PAYG Tiers - dynamically rendered */}
              {Object.values(PRICING_TIERS).map((tier: any) => (
                <div
                  key={tier.id}
                  className={`rounded-lg p-3 border ${
                    tier.id === 'professional'
                      ? 'bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-2 border-teal-300 dark:border-teal-700'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h3>
                      {tier.recommended && (
                        <Badge variant="neutral" className="bg-teal-600 text-white border-teal-600 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{pricingConfig.formatHourlyRate(tier.price_per_hour)}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{pricingConfig.formatLanguageLimitsDescription(tier.translation_limit, tier.total_language_limit)} • No commitment</p>
                </div>
              ))}
            </div>

            {/* No Surprise Charges */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                <span className="font-semibold">No surprise charges!</span>
                <br />
                Use 15 minutes/day forever, or upgrade anytime for unlimited usage.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartSession}
              className="w-full"
            >
              Got It - Start My First Session
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onComparePlans}
              className="w-full"
            >
              Compare Plans First
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Questions? Contact us anytime at{' '}
            <a href="mailto:support@meetingsync.com" className="text-teal-600 dark:text-teal-400 hover:underline">
              support@meetingsync.com
            </a>
          </p>
        </div>
      </Card>
    </SidebarCompactLayout>
  );
}
