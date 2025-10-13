/**
 * Tier Lock-in Utilities
 * 
 * Utilities for managing monthly tier lock-in periods.
 * Users can only change tiers on the 1st of each month.
 */

export const canChangeTier = (tierSelectedDate?: string): boolean => {
  if (!tierSelectedDate) return true; // First time selecting, always allowed
  
  const lastSelectionDate = new Date(tierSelectedDate);
  const now = new Date();
  const firstOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Can change if last selection was before the 1st of current month
  return lastSelectionDate < firstOfCurrentMonth;
};

export const getNextTierChangeDate = (): Date => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
};

export const formatTierLockMessage = (tierSelectedDate?: string): string => {
  if (!tierSelectedDate) return '';
  
  const nextChangeDate = getNextTierChangeDate();
  return `You can select a new tier starting ${nextChangeDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
};

export const getDaysUntilTierChange = (tierSelectedDate?: string): number => {
  if (!tierSelectedDate) return 0;
  
  const now = new Date();
  const nextChangeDate = getNextTierChangeDate();
  const diffTime = nextChangeDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};