// src/data/mockFxTransactions.ts

export type FxTransactionStatus = 'Successful' | 'Pending' | 'Failed';

export interface FxTransaction {
  id: string;
  customerName: string;
  customerId: string;
  transactionId: string;
  fxType: 'Buy' | 'Sell';
  rate: string;
  timestamp: string;
  amount: string;
  status: FxTransactionStatus;
  // Fields for the modal
  amountDeposited: string;
  rateUsed: string;
  payout: string;
  recipientBankName: string;
  debit: string;
  recipientAccountNumber: string;
  deposit: string;
  recipientAccountName: string;
  proofOfPayment: string; // URL to the proof
}

export const mockFxTransactions: FxTransaction[] = [
    { id: '1', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Failed', amountDeposited: '₦25,000.43', rateUsed: 'Payout', payout: '₦0', debit: '₦0', deposit: '₦0', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPayment: '#' },
    { id: '2', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Sell', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Pending', amountDeposited: '₦25,000.43', rateUsed: 'Payout', payout: '₦50,000', debit: '₦10,000', deposit: '₦15,000', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPayment: '#' },
    { id: '3', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Successful', amountDeposited: '₦25,000.43', rateUsed: 'Payout', payout: '₦100,000', debit: '₦20,000', deposit: '₦30,000', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPayment: '#' },
    // Add more mock data as needed
];

// To test the empty state
export const mockEmptyFxTransactions: FxTransaction[] = [];