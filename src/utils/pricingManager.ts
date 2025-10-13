/**
 * Pricing Configuration Manager
 * 
 * Centralized system for managing pricing configuration in MeetingSync.
 * Provides type-safe access to all pricing variables and UI text.
 * 
 * Usage:
 * ```typescript
 * import { pricingConfig } from '../utils/pricingManager';
 * 
 * const freeMinutes = pricingConfig.getFreeTierMinutes();
 * const starterRate = pricingConfig.getPaygTierRate('starter');
 * const uiText = pricingConfig.getUIText('freeTier.upgradePrompt', { total: 15 });
 * ```
 */

import {
  PricingConfiguration,
  PaygTierConfig,
  DEFAULT_PRICING_CONFIG,
  isValidPricingConfig,
  validatePricingConfig
} from '../config/pricing.config';

export class PricingConfigManager {
  private config: PricingConfiguration;
  private listeners: Array<(config: PricingConfiguration) => void> = [];

  constructor(initialConfig?: PricingConfiguration) {
    this.config = initialConfig || DEFAULT_PRICING_CONFIG;
    this.validateConfiguration();
  }

  // ============================================
  // Configuration Management
  // ============================================

  /**
   * Get the complete configuration object
   */
  getConfig(): PricingConfiguration {
    return { ...this.config };
  }

  /**
   * Update the configuration (with validation)
   */
  updateConfig(newConfig: PricingConfiguration): void {
    if (!isValidPricingConfig(newConfig)) {
      throw new Error('Invalid pricing configuration structure');
    }

    const errors = validatePricingConfig(newConfig);
    if (errors.length > 0) {
      throw new Error(`Pricing configuration validation failed: ${errors.join(', ')}`);
    }

    this.config = { ...newConfig };
    
    console.log('[PricingConfig] Configuration updated:', {
      version: newConfig.version,
      environment: newConfig.environment,
      lastUpdated: newConfig.lastUpdated
    });

    // Notify listeners of configuration change
    this.listeners.forEach(listener => listener(this.config));
  }

  /**
   * Subscribe to configuration changes
   */
  onConfigChange(listener: (config: PricingConfiguration) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Validate current configuration
   */
  private validateConfiguration(): void {
    const errors = validatePricingConfig(this.config);
    if (errors.length > 0) {
      console.warn('[PricingConfig] Configuration validation warnings:', errors);
    }
  }

  // ============================================
  // Free Tier Access
  // ============================================

  /**
   * Get free tier daily minutes limit
   */
  getFreeTierMinutes(): number {
    return this.config.freeTier.dailyMinutes;
  }

  /**
   * Get free tier language limits
   */
  getFreeTierLanguageLimits(): { translations: number; total: number } {
    return {
      translations: this.config.freeTier.translationLimit,
      total: this.config.freeTier.totalLanguageLimit
    };
  }

  /**
   * Get free tier configuration
   */
  getFreeTierConfig() {
    return { ...this.config.freeTier };
  }

  // ============================================
  // PAYG Tier Access
  // ============================================

  /**
   * Get PAYG tier configuration by ID
   */
  getPaygTier(tierId: string): PaygTierConfig | null {
    return this.config.paygTiers[tierId] || null;
  }

  /**
   * Get all PAYG tiers
   */
  getAllPaygTiers(): PaygTierConfig[] {
    return Object.values(this.config.paygTiers);
  }

  /**
   * Get PAYG tier base rate per hour
   */
  getPaygTierRate(tierId: string): number {
    const tier = this.getPaygTier(tierId);
    return tier?.baseRatePerHour || 0;
  }

  /**
   * Get PAYG tier overage rate per hour
   */
  getPaygTierOverageRate(tierId: string): number {
    const tier = this.getPaygTier(tierId);
    return tier?.overageRatePerHour || 0;
  }

  /**
   * Get PAYG tier language limits
   */
  getPaygTierLanguageLimits(tierId: string): { translations: number; total: number } {
    const tier = this.getPaygTier(tierId);
    return {
      translations: tier?.translationLimit || 0,
      total: tier?.totalLanguageLimit || 0
    };
  }

  /**
   * Get recommended tier (marked with recommended: true)
   */
  getRecommendedTier(): PaygTierConfig | null {
    return Object.values(this.config.paygTiers).find(tier => tier.recommended) || null;
  }

  // ============================================
  // Participant Scaling
  // ============================================

  /**
   * Calculate participant multiplier based on participant count
   */
  calculateParticipantMultiplier(participantCount: number): {
    participant_count: number;
    multiplier: number;
    base_threshold: number;
    increment_threshold: number;
    increment_rate: number;
  } {
    const { baseThreshold, incrementSize, multiplierRate } = this.config.participantScaling;

    if (participantCount <= baseThreshold) {
      return {
        participant_count: participantCount,
        multiplier: 1.0,
        base_threshold: baseThreshold,
        increment_threshold: incrementSize,
        increment_rate: multiplierRate
      };
    }

    const participantsOverBase = participantCount - baseThreshold;
    const increments = Math.ceil(participantsOverBase / incrementSize);
    const multiplier = 1.0 + (increments * multiplierRate);

    return {
      participant_count: participantCount,
      multiplier: parseFloat(multiplier.toFixed(2)),
      base_threshold: baseThreshold,
      increment_threshold: incrementSize,
      increment_rate: multiplierRate
    };
  }

  /**
   * Get participant scaling configuration
   */
  getParticipantScalingConfig() {
    return { ...this.config.participantScaling };
  }

  // ============================================
  // UI Text and Formatting
  // ============================================

  /**
   * Get UI text with variable substitution
   * @param key - Dot-notation key (e.g., 'freeTier.upgradePrompt')
   * @param variables - Object with variables to substitute
   */
  getUIText(key: string, variables: Record<string, any> = {}): string {
    const keys = key.split('.');
    let value: any = this.config.uiText;

    // Navigate through nested object
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        console.warn(`[PricingConfig] UI text key not found: ${key}`);
        return key; // Return key as fallback
      }
    }

    if (typeof value !== 'string') {
      console.warn(`[PricingConfig] UI text value is not a string: ${key}`);
      return key;
    }

    // Substitute variables in the text
    return this.substituteVariables(value, variables);
  }

  /**
   * Substitute variables in text template
   * Supports {variable} syntax
   */
  private substituteVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, variableName) => {
      if (variableName in variables) {
        return String(variables[variableName]);
      }
      console.warn(`[PricingConfig] Variable not found: ${variableName}`);
      return match; // Return original placeholder if variable not found
    });
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number): string {
    const { currencyCode } = this.config.uiText.general;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  }

  /**
   * Format currency with per-hour suffix
   */
  formatHourlyRate(amount: number): string {
    const { perHourSuffix } = this.config.uiText.general;
    return `${this.formatCurrency(amount)}${perHourSuffix}`;
  }

  /**
   * Format language count with proper units
   */
  formatLanguageCount(count: number, type: 'language' | 'translation' = 'language'): string {
    const { languageUnit, languageUnitPlural, translationUnit, translationUnitPlural } = this.config.uiText.general;
    
    if (type === 'translation') {
      return count === 1 ? `${count} ${translationUnit}` : `${count} ${translationUnitPlural}`;
    } else {
      return count === 1 ? `${count} ${languageUnit}` : `${count} ${languageUnitPlural}`;
    }
  }

  /**
   * Format language limits description
   */
  formatLanguageLimitsDescription(translations: number, totalLanguages: number): string {
    const translationText = this.formatLanguageCount(translations, 'translation');
    return `${translationText} (${totalLanguages} total ${totalLanguages === 1 ? 'language' : 'languages'})`;
  }

  // ============================================
  // Cost Calculations
  // ============================================

  /**
   * Calculate session cost for a PAYG tier
   */
  calculateSessionCost(
    tierId: string,
    durationHours: number,
    participantCount: number,
    overageLanguages: number = 0,
    overageHours: number = 0
  ): number {
    const tier = this.getPaygTier(tierId);
    if (!tier) {
      throw new Error(`Invalid tier ID: ${tierId}`);
    }

    const multiplierData = this.calculateParticipantMultiplier(participantCount);
    
    // Base cost = rate × duration × multiplier
    const baseCost = tier.baseRatePerHour * durationHours * multiplierData.multiplier;
    
    // Overage cost = overage languages × overage hours × overage rate × multiplier
    const overageCost = overageLanguages * overageHours * tier.overageRatePerHour * multiplierData.multiplier;
    
    const totalCost = baseCost + overageCost;
    return parseFloat(totalCost.toFixed(2));
  }

  /**
   * Get break-even analysis between tiers
   */
  getUpgradeThreshold(fromTier: string, toTier: string, participantCount: number = 100): number {
    const fromTierConfig = this.getPaygTier(fromTier);
    const toTierConfig = this.getPaygTier(toTier);
    
    if (!fromTierConfig || !toTierConfig) {
      throw new Error('Invalid tier IDs for comparison');
    }

    const multiplier = this.calculateParticipantMultiplier(participantCount).multiplier;
    
    // Calculate hours where costs are equal
    // fromRate * hours + overageRate * overageHours = toRate * hours
    // Simplified: when is it cheaper to upgrade vs pay overage?
    
    const rateDifference = (toTierConfig.baseRatePerHour - fromTierConfig.baseRatePerHour) * multiplier;
    const overage = fromTierConfig.overageRatePerHour * multiplier;
    
    if (overage <= 0) return Infinity; // No overage, never worth upgrading
    
    return rateDifference / overage; // Hours of overage to break even
  }

  // ============================================
  // Advanced Features
  // ============================================

  /**
   * Get Azure AI cost for a tier (if configured)
   */
  getAzureAiCost(tierId: string): number | null {
    return this.config.advanced?.azureAiCosts?.[tierId] || null;
  }

  /**
   * Get gross margin for a tier (if configured)
   */
  getGrossMargin(tierId: string): number | null {
    return this.config.advanced?.grossMargins?.[tierId] || null;
  }

  /**
   * Get competitor comparison data
   */
  getCompetitorComparison() {
    return this.config.advanced?.competitorComparison || [];
  }
}

// Create singleton instance
export const pricingConfig = new PricingConfigManager();

// Export helper functions for common use cases
export const getPricingTiers = () => pricingConfig.getAllPaygTiers();
export const calculateParticipantMultiplier = (count: number) => pricingConfig.calculateParticipantMultiplier(count);
export const formatCurrency = (amount: number) => pricingConfig.formatCurrency(amount);
export const getFreeTierMinutes = () => pricingConfig.getFreeTierMinutes();
export const getPaygTierRate = (tierId: string) => pricingConfig.getPaygTierRate(tierId);

// For backwards compatibility, create PRICING_TIERS-like object
export const PRICING_TIERS = (() => {
  const instance = new PricingConfigManager();
  const tiers = instance.getAllPaygTiers();
  const result: Record<string, any> = {};
  
  tiers.forEach(tier => {
    result[tier.id] = {
      id: tier.id,
      name: tier.name,
      price_per_hour: tier.baseRatePerHour,
      translation_limit: tier.translationLimit,
      total_language_limit: tier.totalLanguageLimit,
      overage_rate_per_hour: tier.overageRatePerHour,
      features: tier.features,
      ideal_for: tier.idealFor
    };
  });
  
  return result;
})();