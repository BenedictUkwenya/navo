// src/data/mockFxData.ts

export interface FxPricing {
    id: string;
    currencyPair: string;
    baseRate: string;
    finalRate: string;
    timestamp: string;
    lastUpdated: string;
  }
  
  // An array of existing FX prices to display in the table
  export const mockFxPricings: FxPricing[] = [
    {
      id: '1',
      currencyPair: 'USD / NGN',
      baseRate: '1 USD = ₦1480.00',
      finalRate: '₦1502.20',
      timestamp: '2025-06-25T08:00:00Z',
      lastUpdated: '2025-06-25T08:00:00Z',
    },
    {
      id: '2',
      currencyPair: 'USD / NGN',
      baseRate: '1 USD = ₦1480.00',
      finalRate: '₦1502.20',
      timestamp: '2025-06-24T15:42:00Z',
      lastUpdated: '2025-06-24T15:42:00Z',
    },
    {
      id: '3',
      currencyPair: 'USD / NGN',
      baseRate: '1 USD = ₦1480.00',
      finalRate: '₦1502.20',
      timestamp: '2025-06-24T15:42:00Z',
      lastUpdated: '2025-06-24T15:42:00Z',
    },
    // Add more entries if you want the table to be longer
  ];
  
  // We can also have an empty array to easily test the empty state
  export const mockEmptyFxPricings: FxPricing[] = [];