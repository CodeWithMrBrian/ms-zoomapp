/**
 * Example component demonstrating the new dynamic pricing configuration system
 * This shows how components can use the pricing manager for flexible, configurable pricing
 */


import { pricingConfig } from '../utils/pricingManager';

export function PricingDemo() {
  // Get current pricing configuration
  const freeMinutes = pricingConfig.getFreeTierMinutes();
  const freeLimits = pricingConfig.getFreeTierLanguageLimits();
  const starterTier = pricingConfig.getPaygTier('starter');
  const professionalTier = pricingConfig.getPaygTier('professional');

  // Get dynamic UI text
  const upgradeText = pricingConfig.getUIText('freeTier.upgradePrompt', { total: freeMinutes });
  const minutesText = pricingConfig.getUIText('freeTier.minutesRemaining', { remaining: 10, total: freeMinutes });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dynamic Pricing Configuration Demo</h1>
      
      {/* Free Tier Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Free Tier (Dynamic)</h2>
        <p>Daily Minutes: <strong>{freeMinutes}</strong></p>
        <p>Translations: <strong>{freeLimits.translations}</strong></p>
        <p>Total Languages: <strong>{freeLimits.total}</strong></p>
        <p className="text-sm text-green-700 mt-2">{upgradeText}</p>
        <p className="text-sm text-green-700">{minutesText}</p>
      </div>

      {/* PAYG Tiers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Starter Tier */}
        {starterTier && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">{starterTier.name}</h3>
            <p>Rate: <strong>{pricingConfig.formatHourlyRate(starterTier.baseRatePerHour)}</strong></p>
            <p>Languages: <strong>{pricingConfig.formatLanguageLimitsDescription(starterTier.translationLimit, starterTier.totalLanguageLimit)}</strong></p>
            <p>Overage: <strong>{pricingConfig.formatHourlyRate(starterTier.overageRatePerHour)}</strong></p>
            <p className="text-sm text-blue-700 mt-2">{starterTier.description}</p>
          </div>
        )}

        {/* Professional Tier */}
        {professionalTier && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800">
              {professionalTier.name}
              {professionalTier.recommended && (
                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                  {professionalTier.badge}
                </span>
              )}
            </h3>
            <p>Rate: <strong>{pricingConfig.formatHourlyRate(professionalTier.baseRatePerHour)}</strong></p>
            <p>Languages: <strong>{pricingConfig.formatLanguageLimitsDescription(professionalTier.translationLimit, professionalTier.totalLanguageLimit)}</strong></p>
            <p>Overage: <strong>{pricingConfig.formatHourlyRate(professionalTier.overageRatePerHour)}</strong></p>
            <p className="text-sm text-purple-700 mt-2">{professionalTier.description}</p>
          </div>
        )}
      </div>

      {/* Cost Calculator Example */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Dynamic Cost Calculator</h3>
        <div className="space-y-2">
          <p>100 participants, 1 hour, Professional tier:</p>
          <p className="text-xl font-bold text-green-600">
            {pricingConfig.formatCurrency(pricingConfig.calculateSessionCost('professional', 1, 100))}
          </p>
          
          <p>250 participants, 1 hour, Professional tier:</p>
          <p className="text-xl font-bold text-green-600">
            {pricingConfig.formatCurrency(pricingConfig.calculateSessionCost('professional', 1, 250))}
          </p>
          
          <p className="text-sm text-gray-600">
            Participant multiplier for 250 people: {pricingConfig.calculateParticipantMultiplier(250).multiplier}x
          </p>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Configuration Management</h3>
        <p className="text-sm text-yellow-700">
          All pricing values are now configurable! To change prices:
        </p>
        <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
          <li>Update the configuration in <code>src/config/pricing.config.ts</code></li>
          <li>No code changes needed - UI updates automatically</li>
          <li>Full type safety and validation included</li>
        </ol>
      </div>
    </div>
  );
}