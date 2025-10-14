import { MOCK_SESSION_DETAIL } from '../utils/mockSessionDetails';
import { MOCK_SESSION_ACTIVE } from '../utils/mockData';
import React, { useState } from 'react';
import { LANGUAGES, PRICING_TIERS } from '../utils/constants';
import { pricingConfig } from '../utils/pricingManager';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

/**
 * Test Mode Selector - Redesigned V2
 *
 * Two distinct testing paths:
 * 1. Full Journey: Complete first-time user experience (OAuth → Daily Free Tier → Host)
 * 2. Direct Access: Skip to main pages with paid account configuration
 */

export type TestPath = 'full-journey' | 'direct-access';
export type TestAccountType =
  | 'free-tier'         // 15 min/day free (ongoing forever)
  | 'payg-no-tier'      // PAYG with payment method but no tier selected
  | 'payg-starter'      // $45/hr - 3 languages (English, Spanish, French)
  | 'payg-professional' // $75/hr - 7 languages
  | 'payg-enterprise';  // $95/hr - ALL languages (50+)
export type TestRole = 'host' | 'participant';

export interface TestModeConfig {
  path: TestPath;
  accountType: TestAccountType;
  role: TestRole;
}

interface TestModeSelectorProps {
  onStart: (config: TestModeConfig) => void;
}

export function TestModeSelector({ onStart }: TestModeSelectorProps) {
  const [step, setStep] = useState<'path' | 'direct-config'>('path');
  // ...existing code...
  const [accountType, setAccountType] = useState<TestAccountType>('payg-starter');
  const [role, setRole] = useState<TestRole>('host');

  // Selected languages for Participant view

  // Helper: Get allowed language count for current accountType
  function getAllowedLanguageCount(accountType: TestAccountType): number {
    if (accountType === 'free-tier') {
      return pricingConfig.getFreeTierLanguageLimits().total;
    }
    if (accountType.startsWith('payg-')) {
      // Extract tier id (e.g., 'starter', 'professional', 'enterprise')
      const tierId = accountType.replace('payg-', '');
      return pricingConfig.getPaygTierLanguageLimits(tierId).total;
    }
    return 0;
  }

  // Effect: When role/accountType changes to Participant, auto-select languages
  React.useEffect(() => {
    if (role === 'participant') {
      // Auto-select appropriate number of languages based on account type
      getAllowedLanguageCount(accountType);
    }
  }, [role, accountType]);

  const handlePathSelection = (path: TestPath) => {
    if (path === 'full-journey') {
      // Full journey defaults to daily free tier + host
      onStart({
        path: 'full-journey',
        accountType: 'free-tier',
        role: 'host'
      });
    } else {
      // Direct access requires configuration
  // ...existing code...
      setStep('direct-config');
    }
  };

  const handleDirectAccessStart = () => {
    // Set up correct language pool for Participant
    if (role === 'participant') {
      let maxLanguages = 0;
      if (accountType === 'free-tier') {
        maxLanguages = pricingConfig.getFreeTierLanguageLimits().total;
      } else if (accountType.startsWith('payg-')) {
        const tierId = accountType.replace('payg-', '');
        maxLanguages = pricingConfig.getPaygTierLanguageLimits(tierId).total;
      }
      let selected: string[] = [];
      if (accountType === 'payg-enterprise') {
        // For enterprise, select the first 16 unique language codes from LANGUAGES
        const seen = new Set<string>();
        for (const lang of LANGUAGES) {
          if (!seen.has(lang.code)) {
            seen.add(lang.code);
            selected.push(lang.code);
            if (selected.length === maxLanguages) break;
          }
        }
      } else {
        // For other tiers, pick most popular (always include English if present)
        const base = LANGUAGES.map(l => l.code);
        const [en, ...rest] = base[0] === 'en' ? [base[0], ...base.slice(1)] : [null, ...base];
        const shuffled = rest.sort(() => 0.5 - Math.random());
        selected = (en ? [en] : []).concat(shuffled).slice(0, maxLanguages);
      }
      // Patch the mock session's target_languages for both detail and active session
      MOCK_SESSION_DETAIL.target_languages = selected;
      MOCK_SESSION_ACTIVE.target_languages = selected;
    }
    onStart({
      path: 'direct-access',
      accountType,
      role
    });
  };

  // Step 1: Path Selection
  if (step === 'path') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <Card variant="beautiful" padding="lg" className="max-w-2xl w-full">
          <CardHeader>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl">MeetingSync Test Mode</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Choose how you want to test the app
              </p>
              <Badge variant="warning" className="mt-2">
                Development Mode Only
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
                Choose how you want to test:
              </h3>

              {/* Test from the Start Option */}
              <div
                onClick={() => handlePathSelection('full-journey')}
                className="group cursor-pointer"
              >
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          1. Test from the Start
                        </h4>
                        <Badge variant="info">Recommended</Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Experience the complete user journey from the beginning
                      </p>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          You'll experience:
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-teal-600 dark:text-teal-400">→</span>
                            <span className="text-gray-700 dark:text-gray-300">Zoom SSO authorization screen</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-teal-600 dark:text-teal-400">→</span>
                            <span className="text-gray-700 dark:text-gray-300">Welcome screen with daily free tier offer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-teal-600 dark:text-teal-400">→</span>
                            <span className="text-gray-700 dark:text-gray-300">Daily free tier activation confirmation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-teal-600 dark:text-teal-400">→</span>
                            <span className="text-gray-700 dark:text-gray-300">Host setup & first session</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-teal-600 dark:text-teal-400 font-medium">Best for:</span>
                        <span className="text-gray-600 dark:text-gray-400">Testing conversion flow & first-run experience</span>
                      </div>

                      <div className="mt-4">
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full group-hover:shadow-lg transition-shadow"
                        >
                          Start from Beginning →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test a Specific Page Option */}
              <div
                onClick={() => handlePathSelection('direct-access')}
                className="group cursor-pointer"
              >
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          2. Test a Specific Page
                        </h4>
                        <Badge variant="neutral">Fast Testing</Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Jump directly to any page to test specific features
                      </p>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          What you'll configure:
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">•</span>
                            <span className="text-gray-700 dark:text-gray-300">Account type (PAYG tier: Starter/Professional/Enterprise)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">•</span>
                            <span className="text-gray-700 dark:text-gray-300">Your role (Host or Participant)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm mb-4">
                        <span className="text-purple-600 dark:text-purple-400 font-medium">Best for:</span>
                        <span className="text-gray-600 dark:text-gray-400">Testing specific features quickly</span>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300">
                        <strong>Note:</strong> Scenario status (Near Limit, Limit Reached, etc.) can be adjusted anytime using the Simulation Controls panel.
                      </div>

                      <div className="mt-4">
                        <Button
                          variant="secondary"
                          size="lg"
                          className="w-full group-hover:shadow-lg transition-shadow"
                        >
                          Choose Specific Page →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Both paths include:</strong>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• Floating "Start Over" button to return here</li>
                      <li>• Sidebar width selector (Windows/Mac/Tablet/Desktop)</li>
                      <li>• All data is mocked - no backend required</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Direct Access Configuration
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <Card variant="beautiful" padding="lg" className="max-w-2xl w-full">
        <CardHeader>
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl">Select Page to Test</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Choose account type and role for testing
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-8">
            {/* Account Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                1. Account Type
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {/* Daily Free Tier */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  accountType === 'free-tier'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="free-tier"
                    checked={accountType === 'free-tier'}
                    onChange={(e) => setAccountType(e.target.value as TestAccountType)}
                    className="mt-1 w-5 h-5 text-teal-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Daily Free Tier
                      </div>
                      <Badge variant="success">FREE FOREVER</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      15 min/day • 2 translations (3 total languages) • Resets daily • No credit card required
                    </p>
                  </div>
                </label>

                {/* PAYG No Tier (Tier Selection State) */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  accountType === 'payg-no-tier'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="payg-no-tier"
                    checked={accountType === 'payg-no-tier'}
                    onChange={(e) => setAccountType(e.target.value as TestAccountType)}
                    className="mt-1 w-5 h-5 text-teal-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        PAYG - No Tier Selected
                      </div>
                      <Badge variant="warning">NEEDS TIER</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment method added • No tier selected yet • Shows tier selection UI
                    </p>
                  </div>
                </label>

                {/* PAYG Starter */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  accountType === 'payg-starter'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="payg-starter"
                    checked={accountType === 'payg-starter'}
                    onChange={(e) => setAccountType(e.target.value as TestAccountType)}
                    className="mt-1 w-5 h-5 text-teal-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {`Pay-As-You-Go (${PRICING_TIERS['starter'].name})`}
                      </div>
                      <Badge variant="info">{pricingConfig.formatHourlyRate(PRICING_TIERS['starter'].price_per_hour)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pricingConfig.formatLanguageLimitsDescription(PRICING_TIERS['starter'].translation_limit, PRICING_TIERS['starter'].total_language_limit)} • Pay per hour • No commitment
                    </p>
                  </div>
                </label>

                {/* PAYG Professional */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  accountType === 'payg-professional'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="payg-professional"
                    checked={accountType === 'payg-professional'}
                    onChange={(e) => setAccountType(e.target.value as TestAccountType)}
                    className="mt-1 w-5 h-5 text-teal-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {`Pay-As-You-Go (${PRICING_TIERS['professional'].name})`}
                      </div>
                      <Badge variant="success">{pricingConfig.formatHourlyRate(PRICING_TIERS['professional'].price_per_hour)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pricingConfig.formatLanguageLimitsDescription(PRICING_TIERS['professional'].translation_limit, PRICING_TIERS['professional'].total_language_limit)} • Pay per hour • No commitment
                    </p>
                  </div>
                </label>

                {/* PAYG Enterprise */}
                <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  accountType === 'payg-enterprise'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="payg-enterprise"
                    checked={accountType === 'payg-enterprise'}
                    onChange={(e) => setAccountType(e.target.value as TestAccountType)}
                    className="mt-1 w-5 h-5 text-teal-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {`Pay-As-You-Go (${PRICING_TIERS['enterprise'].name})`}
                      </div>
                      <Badge variant="neutral" className="bg-purple-600 text-white border-purple-600">
                        {pricingConfig.formatHourlyRate(PRICING_TIERS['enterprise'].price_per_hour)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pricingConfig.formatLanguageLimitsDescription(PRICING_TIERS['enterprise'].translation_limit, PRICING_TIERS['enterprise'].total_language_limit)} • Pay per hour • No commitment
                    </p>
                  </div>
                </label>


              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                2. Your Role
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  role === 'host'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="host"
                    checked={role === 'host'}
                    onChange={(e) => setRole(e.target.value as TestRole)}
                    className="mt-1 w-5 h-5 text-teal-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Host
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Setup • Active session • Settings
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 border-2 rounded-lg transition-all ${
                  role === 'participant'
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  } ${accountType === 'payg-no-tier' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-disabled={accountType === 'payg-no-tier'}
                >
                  <input
                    type="radio"
                    name="role"
                    value="participant"
                    checked={role === 'participant'}
                    onChange={(e) => {
                      if (accountType !== 'payg-no-tier') setRole(e.target.value as TestRole);
                    }}
                    className="mt-1 w-5 h-5 text-teal-600"
                    disabled={accountType === 'payg-no-tier'}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Participant
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Language select • Live captions
                    </p>
                    {accountType === 'payg-no-tier' && (
                      <span className="text-xs text-amber-600 dark:text-amber-400">Select a tier to enable Participant</span>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Scenario status (Near Limit, Limit Reached, Just Upgraded, etc.) can be adjusted anytime using the <strong>Simulation Controls panel</strong> on the left side.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep('path')}
                className="flex-1"
              >
                ← Back
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={handleDirectAccessStart}
                className="flex-1"
              >
                Start Testing →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
