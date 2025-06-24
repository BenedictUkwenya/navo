// src/types/customer.ts

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    is_active: boolean;
    createdAt: string; // ISO date string
    profilePicture?: string; // Optional
    gender: string;
    wallet?: {
      walletBalanceNGN: number;
      walletBalanceGBP: number;
    };
    shipments?: any[]; // We can define this more strictly later
    referral?: any;    // We can define this more strictly later
  }
  
  export interface CustomerApiResponse {
    customers: Customer[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasMore: boolean;
    };
  }
  
  export interface CustomerDetailApiResponse {
      customer: Customer;
  }