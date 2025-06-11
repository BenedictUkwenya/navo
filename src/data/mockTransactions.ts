// src/data/mockTransactions.ts

export type TransactionStatus = 'Successful' | 'Pending' | 'Failed';
export type TransactionCategory = 'Shipment' | 'Shop4me' | 'Airtime' | 'Data';

// 1. ADD NEW FIELDS TO THE INTERFACE
export interface Transaction {
  id: string;
  transactionId: string;
  customerName: string; // This will be our "Sender"
  category: TransactionCategory;
  amount: number;
  date: string;
  timestamp: string; // For the detailed time
  type: 'Debit' | 'Credit';
  channel: 'Deposit' | 'Card' | 'Transfer'; // Added Channel
  remark: string; // Added Remark
  status: TransactionStatus;
}

// 2. UPDATE THE MOCK DATA ARRAY
export const mockTransactions: Transaction[] = [
  { id: 'tran_1', transactionId: 'TRWD-TR000576497599964', customerName: 'Oladapo Koiki', category: 'Shipment', amount: 25000.43, date: '2025-02-14', timestamp: '2025-02-14T20:00:00Z', type: 'Debit', channel: 'Deposit', remark: 'Payment for shipment to Nigeria', status: 'Pending' },
  { id: 'tran_2', transactionId: 'TRWD-TR000576497599965', customerName: 'Adebayo Tunde', category: 'Shop4me', amount: 150200.00, date: '2025-02-13', timestamp: '2025-02-13T10:30:00Z', type: 'Debit', channel: 'Card', remark: 'Shop4Me order #S4M-123', status: 'Successful' },
  { id: 'tran_3', transactionId: 'TRWD-TR000576497599966', customerName: 'Chioma Nwosu', category: 'Airtime', amount: 5000.00, date: '2025-02-12', timestamp: '2025-02-12T15:45:00Z', type: 'Debit', channel: 'Transfer', remark: 'Airtime top-up', status: 'Failed' },
  // Add a few more for variety
  { id: 'tran_4', transactionId: 'TRWD-TR000576497599967', customerName: 'Musa Aliyu', category: 'Data', amount: 10000.00, date: '2025-02-11', timestamp: '2025-02-11T09:00:00Z', type: 'Debit', channel: 'Deposit', remark: 'Monthly data subscription', status: 'Successful' },
  { id: 'tran_5', transactionId: 'TRWD-TR000576497599968', customerName: 'Titi Benson', category: 'Shipment', amount: 375000.80, date: '2025-02-10', timestamp: '2025-02-10T18:10:00Z', type: 'Debit', channel: 'Card', remark: 'Shipment fee to UK', status: 'Pending' },
];