// --- For the FX PRICING Tab ---
export interface FxRate {
  id: string; fromCurrency: string; toCurrency: string;
  buyRate: number; sellRate: number; createdAt: string; updatedAt: string;
}
export interface FxRateHistoryResponse {
  success: boolean; results: FxRate[]; pagination: any;
}

// --- For the FX TRANSACTION Tab ---
interface FxTransactionUser {
  id: string; firstName: string | null; lastName: string | null; email: string;
}
interface NestedTransaction {
  id: string; paymentStatus: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  transactionReference: string; currency: string;
  amountPaid: string; 
}
export interface FxTransaction {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  currentRate: number;
  createdAt: string;
  user: FxTransactionUser;
  transaction: NestedTransaction;
  
  // === NEW FIELDS FROM THE API ===
  recipientBankName: string | null;
  recipientAccountName: string | null;
  recipientAccountNumber: string | null;
}

export interface FxTransactionsApiResponse {
  success: boolean;
  results: FxTransaction[];
  pagination: any;
}