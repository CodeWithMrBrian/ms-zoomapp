import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { User, SubscriptionTier, BillingType } from '../types';
import {
  MOCK_USER_PAYG,
  MOCK_USER_PAYG_STARTER,
  MOCK_USER_PAYG_PROFESSIONAL,
  MOCK_USER_PAYG_ENTERPRISE,
  MOCK_USER_FREE_ZOOM,
  MOCK_USER_FREE_TRIAL,
  getMockUserByType
} from '../utils/mockData';

/**
 * User Context
 *
 * Manages user account state including:
 * - Billing type (PAYG only - postpaid model)
 * - PAYG tier (Starter, Professional, Enterprise)
 * - Usage tracking (unpaid usage accumulation)
 * - Payment method information
 * - Daily free tier (15 minutes free every day)
 *
 * Postpaid PAYG Model:
 * - User adds payment method (no upfront charge)
 * - Usage accumulates during billing period
 * - Billed automatically at end of month
 *
 * Daily Free Tier:
 * - 15 minutes free every day (forever)
 * - Resets at midnight automatically
 * - No payment method required
 * - Upgrade anytime to PAYG for unlimited usage
 *
 * For testing, allows switching between mock users.
 */

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // User type checks
  isPAYG: boolean; // True if payment method added
  isFreeZoomUser: boolean;
  isHost: boolean;

  // Tier checks
  isStarter: boolean;
  isProfessional: boolean;
  isEnterprise: boolean;

  // Usage tracking (postpaid PAYG)
  hasPaymentMethod: boolean;
  isHighUsage: boolean; // High unpaid usage (>$150)

  // Daily Free Tier
  isDailyFreeTier: boolean; // True if no payment method (free tier forever)
  dailyMinutesRemaining: number; // Minutes remaining today (0-15)
  dailyMinutesUsed: number; // Minutes used today (0-15)

  // Actions
  setUser: (user: User | null) => void;
  switchToMockUser: (userType: 'payg' | 'free' | 'trial' | 'free-tier') => void;
  addUnpaidUsage: (amount: number) => void;
  setPaymentMethodAdded: (added: boolean) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  addDailyFreeMinutes: (minutes: number) => void; // Track daily free usage
  resetDailyFreeMinutes: () => void; // Manual reset (for testing)
  checkDailyFreeReset: () => void; // Auto-check if date changed
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

/**
 * UserProvider Component
 *
 * Provides user account state and billing management to all components.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <UserProvider>
 *       <YourApp />
 *     </UserProvider>
 *   );
 * }
 * ```
 */
export function UserProvider({ children, testUserType }: { children: ReactNode; testUserType?: 'payg' | 'payg-no-tier' | 'payg-starter' | 'payg-professional' | 'payg-enterprise' | 'free' | 'trial' | 'free-tier' }) {
  // Initialize user based on test mode or default to PAYG no-tier for testing
  const initialUser = testUserType ? getMockUserByType(testUserType) : getMockUserByType('payg-no-tier');
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User type checks
  const isPAYG = useMemo(() => {
    if (!user) return false;
    return user.payment_method_added === true;
  }, [user]);
  const isFreeZoomUser = user?.zoom_account_type === 1; // Basic Zoom account
  const isHost = true; // In Zoom app, determined by userContext.role === 'host'

  // Tier checks
  const isStarter = user?.subscription_tier === 'starter';
  const isProfessional = user?.subscription_tier === 'professional';
  const isEnterprise = user?.subscription_tier === 'enterprise';

  // Usage tracking (postpaid PAYG)
  const hasPaymentMethod = useMemo(() => {
    if (!user) return false;
    return user.payment_method_added === true;
  }, [user]);

  const isHighUsage = useMemo(() => {
    // PAYG users: warn when unpaid usage exceeds $150
    return (user?.unpaid_usage || 0) > 150;
  }, [user]);

  // Daily Free Tier tracking
  const isDailyFreeTier = useMemo(() => {
    if (!user) return false;
    // True free tier users: explicitly marked as free tier AND no payment method
    // This excludes PAYG users who have payment method but no tier selected
    return user.is_free_tier === true && !user.payment_method_added;
  }, [user]);

  const dailyMinutesRemaining = useMemo(() => {
    if (!user || !isDailyFreeTier) return 0;
    return user.daily_free_minutes_remaining || 15;
  }, [user, isDailyFreeTier]);

  const dailyMinutesUsed = useMemo(() => {
    if (!user || !isDailyFreeTier) return 0;
    return user.daily_free_minutes_used || 0;
  }, [user, isDailyFreeTier]);

  /**
   * Switch between mock users for testing
   */
  const switchToMockUser = useCallback((userType: 'payg' | 'free' | 'trial' | 'free-tier') => {
    const mockUser = getMockUserByType(userType);
    setUser(mockUser);
    console.log(`[UserContext] Switched to ${userType} user:`, mockUser.name);
  }, []);

  /**
   * Add to unpaid usage (postpaid PAYG model)
   */
  const addUnpaidUsage = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newUsage = (prev.unpaid_usage || 0) + amount;
      console.log(`[UserContext] Added $${amount.toFixed(2)} to unpaid usage. Total: $${newUsage.toFixed(2)}`);
      return {
        ...prev,
        unpaid_usage: newUsage
      };
    });
  }, []);

  /**
   * Mark payment method as added
   */
  const setPaymentMethodAdded = useCallback((added: boolean) => {
    setUser(prev => {
      if (!prev) return prev;
      console.log(`[UserContext] Payment method ${added ? 'added' : 'removed'}`);
      return {
        ...prev,
        payment_method_added: added,
        payment_method: added ? 'Visa ****1234' : undefined,
        // When payment method is added, user is no longer on free tier
        is_free_tier: added ? false : prev.is_free_tier
      };
    });
  }, []);

  /**
   * Add daily free minutes used (15-minute daily limit)
   */
  const addDailyFreeMinutes = useCallback((minutes: number) => {
    setUser(prev => {
      if (!prev || !prev.is_free_tier) return prev;

      const currentUsed = prev.daily_free_minutes_used || 0;
      const newUsed = Math.min(15, currentUsed + minutes);
      const newRemaining = Math.max(0, 15 - newUsed);

      console.log(`[UserContext] Daily free: Added ${minutes} minutes. Used: ${newUsed}/15, Remaining: ${newRemaining}`);

      return {
        ...prev,
        daily_free_minutes_used: newUsed,
        daily_free_minutes_remaining: newRemaining
      };
    });
  }, []);

  /**
   * Reset daily free minutes (midnight reset or manual)
   */
  const resetDailyFreeMinutes = useCallback(() => {
    setUser(prev => {
      if (!prev || !prev.is_free_tier) return prev;

      const today = new Date().toISOString().split('T')[0];

      console.log(`[UserContext] Daily free: Reset to 15 minutes (date: ${today})`);

      return {
        ...prev,
        daily_free_minutes_used: 0,
        daily_free_minutes_remaining: 15,
        daily_free_reset_date: today
      };
    });
  }, []);

  /**
   * Check if daily free minutes need reset (auto-check on date change)
   */
  const checkDailyFreeReset = useCallback(() => {
    if (!user || !user.is_free_tier) return;

    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = user.daily_free_reset_date;

    // Reset if date changed or no reset date set
    if (!lastResetDate || lastResetDate !== today) {
      console.log(`[UserContext] Daily free: Date changed (${lastResetDate} → ${today}), triggering reset`);
      resetDailyFreeMinutes();
    }
  }, [user, resetDailyFreeMinutes]);

  /**
   * Set subscription tier and initialize billing period (tier lock model)
   * Called when user selects tier on first session of billing period
   */
  const setSubscriptionTier = useCallback((tier: SubscriptionTier) => {
    setUser(prev => {
      if (!prev) return prev;

      const today = new Date();
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      console.log(`[UserContext] Setting tier to ${tier} for billing period ${today.toISOString().split('T')[0]} to ${endOfMonth.toISOString().split('T')[0]}`);

      return {
        ...prev,
        subscription_tier: tier,
        billing_period_start: today.toISOString().split('T')[0],
        billing_period_end: endOfMonth.toISOString().split('T')[0]
      };
    });
  }, []);

  /**
   * Auto-check daily free reset on mount and every hour
   */
  useEffect(() => {
    checkDailyFreeReset();

    // Check every hour for date change
    const interval = setInterval(() => {
      checkDailyFreeReset();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [checkDailyFreeReset]);

  /**
   * Refresh user data from backend (mock implementation)
   */
  const refreshUser = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation, fetch from backend:
      // const response = await fetch(`/api/users/${user.id}`);
      // const updatedUser = await response.json();
      // setUser(updatedUser);

      console.log('[UserContext] User data refreshed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh user data';
      setError(message);
      console.error('[UserContext] Refresh failed:', message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value: UserContextValue = {
    user,
    isLoading,
    error,
    isPAYG,
    isFreeZoomUser,
    isHost,
    isStarter,
    isProfessional,
    isEnterprise,
    hasPaymentMethod,
    isHighUsage,
    isDailyFreeTier,
    dailyMinutesRemaining,
    dailyMinutesUsed,
    setUser,
    switchToMockUser,
    addUnpaidUsage,
    setPaymentMethodAdded,
    setSubscriptionTier,
    addDailyFreeMinutes,
    resetDailyFreeMinutes,
    checkDailyFreeReset,
    refreshUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * useUser Hook
 *
 * Access user account state and billing information from any component.
 *
 * @returns {UserContextValue} User state and management methods
 * @throws {Error} If used outside UserProvider
 *
 * @example
 * ```tsx
 * function AccountInfo() {
 *   const { user, isPAYG, hasCredits, isNearLimit } = useUser();
 *
 *   return (
 *     <div>
 *       <h2>{user?.name}</h2>
 *       <p>Billing: Pay-as-you-go (PAYG only)</p>
 *       {isNearLimit && <Alert>Low credit balance!</Alert>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
