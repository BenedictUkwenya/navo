// src/types/dashboard.ts

export interface RecentTransactionUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface RecentTransaction {
  id: string;
  amount: number;
  currency: 'NGN' | 'GBP';
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  type: string;
  createdAt: string; // This will be an ISO date string
  user: RecentTransactionUser;
}

// Corresponds to the /metrics endpoint
export interface DashboardMetrics {
  totalShipments: number;
  totalCustomers: number;
  completedShipments: number;
  totalTransactionsNGN: number;
  totalTransactionsGBP: number;
  totalShopForMeRequests: number;
  recentTransactions: RecentTransaction[];
}

// Corresponds to the /growth endpoint
export interface DashboardGrowth {
  shipmentsGrowth: number;
  customersGrowth: number;
  completedShipmentsGrowth: number;
}