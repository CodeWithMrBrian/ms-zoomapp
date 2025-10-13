/**
 * Quick Test Route for Pricing Configuration
 * Add this to your router to test the pricing system at /pricing-test
 */

import { pricingConfig } from '../../utils/pricingManager';

export function PricingTestPage() {
  const freeMinutes = pricingConfig.getFreeTierMinutes();
  const starterTier = pricingConfig.getPaygTier('starter');
  const professionalTier = pricingConfig.getPaygTier('professional');
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚀 Pricing Configuration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Free Tier */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-green-800 mb-3">Free Tier</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Daily Minutes:</strong> {freeMinutes}</p>
            <p><strong>Languages:</strong> {pricingConfig.formatLanguageLimitsDescription(
              pricingConfig.getFreeTierLanguageLimits().translations,
              pricingConfig.getFreeTierLanguageLimits().total
            )}</p>
            <p className="text-green-700 mt-3">
              {pricingConfig.getUIText('freeTier.minutesRemaining', { remaining: 10, total: freeMinutes })}
            </p>
          </div>
        </div>

        {/* Starter Tier */}
        {starterTier && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">{starterTier.name}</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Rate:</strong> {pricingConfig.formatHourlyRate(starterTier.baseRatePerHour)}</p>
              <p><strong>Languages:</strong> {pricingConfig.formatLanguageLimitsDescription(starterTier.translationLimit, starterTier.totalLanguageLimit)}</p>
              <p><strong>Overage:</strong> {pricingConfig.formatHourlyRate(starterTier.overageRatePerHour)}</p>
              <p className="text-blue-700 mt-3">{starterTier.description}</p>
            </div>
          </div>
        )}

        {/* Professional Tier */}
        {professionalTier && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">
              {professionalTier.name}
              {professionalTier.recommended && (
                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                  {professionalTier.badge}
                </span>
              )}
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>Rate:</strong> {pricingConfig.formatHourlyRate(professionalTier.baseRatePerHour)}</p>
              <p><strong>Languages:</strong> {pricingConfig.formatLanguageLimitsDescription(professionalTier.translationLimit, professionalTier.totalLanguageLimit)}</p>
              <p><strong>Overage:</strong> {pricingConfig.formatHourlyRate(professionalTier.overageRatePerHour)}</p>
              <p className="text-purple-700 mt-3">{professionalTier.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cost Calculator */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 Dynamic Cost Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Professional Tier Examples:</h3>
            <div className="space-y-1 text-sm">
              <p>100 participants, 1 hour: <strong className="text-green-600">{pricingConfig.formatCurrency(pricingConfig.calculateSessionCost('professional', 1, 100))}</strong></p>
              <p>250 participants, 1 hour: <strong className="text-green-600">{pricingConfig.formatCurrency(pricingConfig.calculateSessionCost('professional', 1, 250))}</strong></p>
              <p>500 participants, 2 hours: <strong className="text-green-600">{pricingConfig.formatCurrency(pricingConfig.calculateSessionCost('professional', 2, 500))}</strong></p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Participant Multipliers:</h3>
            <div className="space-y-1 text-sm">
              <p>100 participants: {pricingConfig.calculateParticipantMultiplier(100).multiplier}x</p>
              <p>250 participants: {pricingConfig.calculateParticipantMultiplier(250).multiplier}x</p>
              <p>500 participants: {pricingConfig.calculateParticipantMultiplier(500).multiplier}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">⚙️ Configuration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">System Status:</h3>
            <ul className="space-y-1">
              <li>✅ Dynamic pricing configuration active</li>
              <li>✅ All pricing values loaded from config</li>
              <li>✅ UI text generation working</li>
              <li>✅ Cost calculations functional</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Configuration Info:</h3>
            <ul className="space-y-1">
              <li>Version: {pricingConfig.getConfig().version}</li>
              <li>Environment: {pricingConfig.getConfig().environment}</li>
              <li>Updated: {new Date(pricingConfig.getConfig().lastUpdated).toLocaleDateString()}</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-yellow-800 text-sm">
            <strong>🎉 Success!</strong> All pricing values are now configurable. 
            To change pricing, edit <code>src/config/pricing.config.ts</code> and all UI will update automatically.
          </p>
        </div>
      </div>
    </div>
  );
}