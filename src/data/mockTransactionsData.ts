// src/data/mockTransactionsData.ts

export type TransactionStatus = 'Successful' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  customerName: string;
  customerId: string;
  transactionId: string;
  fxType: 'Buy' | 'Sell';
  rate: string;
  timestamp: string;
  amount: string;
  status: TransactionStatus;
  // Fields for the modal
  amountDeposited: string;
  rateUsed: string;
  recipientBankName: string;
  recipientAccountNumber: string;
  recipientAccountName: string;
  proofOfPaymentUrl: string;
}

export const mockTransactions: Transaction[] = [
    { id: '1', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Failed', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '2', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Sell', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Pending', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '3', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Successful', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '4', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Sell', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Failed', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '5', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Successful', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '6', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Sell', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Pending', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '7', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Pending', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
    { id: '8', customerName: 'Oladapo Koiki', customerId: '42783496gh', transactionId: 'Shipment', fxType: 'Buy', rate: '₦2,050', timestamp: '02/02/2025, 8:00AM', amount: '₦2,050,000', status: 'Pending', amountDeposited: '₦25,000.43', rateUsed: 'Payout', recipientBankName: 'Debit', recipientAccountNumber: 'Deposit', recipientAccountName: 'Pending', proofOfPaymentUrl: '#' },
];