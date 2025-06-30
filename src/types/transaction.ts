// src/types/transaction.ts

// Using camelCase for consistency and to match the API data
interface TransactionUser {
  id: string;
  firstName: string | null; // Handle null names
  lastName: string | null;
  email: string;
}

export interface Transaction {
  id: string;
  user: TransactionUser;
  amountPaid: string;
  createdAt: string;
  paymentStatus: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  paymentType: string;
  category: string;
  transactionReference: string; // <-- ADDED THIS FIELD
  channel?: string;
  remark?: string;
  currency: 'NGN' | 'GBP'; // Added for currency formatting
}

export interface TransactionsApiResponse {
  status: string;
  data: {
    transactions: Transaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number; // The API sends totalItems
      limit: number;
    };
  };
}

export interface TransactionDetailApiResponse {
    status: string;
    data: {
      transaction: Transaction;
    };
}