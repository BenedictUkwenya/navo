// src/types/transaction.ts

interface TransactionUser {
  id: string;
  firstName: string;
  lastName: string;
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
  channel?: string;
  remark?: string;
}

// === THE MISSING INTERFACES (NOW ADDED AND EXPORTED) ===

// For the list of all transactions (GET /transactions)
export interface TransactionsApiResponse {
  status: string;
  data: {
    transactions: Transaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
    };
  };
}

// For a single transaction's details (GET /transactions/{id})
export interface TransactionDetailApiResponse {
    status: string;
    data: {
      transaction: Transaction;
    };
}