/**
 * Mock Payment Methods Data
 *
 * Simulated credit card data for payment management pages
 */

export interface PaymentMethod {
  id: string;
  type: 'card';
  brand: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  exp_month: number;
  exp_year: number;
  cardholder_name: string;
  is_default: boolean;
  billing_address?: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
}

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    exp_month: 12,
    exp_year: 2026,
    cardholder_name: 'John Doe',
    is_default: true,
    billing_address: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'US'
    },
    created_at: '2024-01-15'
  },
  {
    id: 'pm_2',
    type: 'card',
    brand: 'mastercard',
    last4: '5555',
    exp_month: 8,
    exp_year: 2025,
    cardholder_name: 'John Doe',
    is_default: false,
    billing_address: {
      line1: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'US'
    },
    created_at: '2023-06-22'
  },
  {
    id: 'pm_3',
    type: 'card',
    brand: 'amex',
    last4: '1001',
    exp_month: 3,
    exp_year: 2027,
    cardholder_name: 'John Doe',
    is_default: false,
    created_at: '2025-02-10'
  }
];
