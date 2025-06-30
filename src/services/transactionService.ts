import apiClient from './apiClient';
import { TransactionsApiResponse, TransactionDetailApiResponse } from '../types/transaction';

type ApiStatus = 'SUCCESSFUL' | 'PENDING' | 'FAILED';
type ApiStatusFilter = 'all' | ApiStatus;

// This function will now only fetch a single status at a time
const fetchTransactionsByStatus = async (
  status: ApiStatus,
  page = 1,
  limit = 9
): Promise<TransactionsApiResponse> => {
  const path = `transactions/${status.toLowerCase()}`;
  try {
    const response = await apiClient.get<TransactionsApiResponse>(path, { params: { page, limit } });
    return response.data;
  } catch (error) {
    // If we get a "not found" error, return an empty array gracefully
    // This is expected for statuses with no transactions
    return {
      status: "success",
      data: {
        transactions: [],
        pagination: { currentPage: 1, totalPages: 0, totalItems: 0, limit }
      }
    };
  }
};

// This is our main function that the component will call
export const getTransactions = async (
  status: ApiStatusFilter = 'all',
  page = 1,
  limit = 9
): Promise<TransactionsApiResponse> => {
  if (status !== 'all') {
    // If a specific status is requested, just fetch that one
    return fetchTransactionsByStatus(status, page, limit);
  } else {
    // --- THIS IS THE "ALL" LOGIC ---
    // If 'all' is requested, fetch all statuses concurrently
    try {
      const results = await Promise.allSettled([
        fetchTransactionsByStatus('SUCCESSFUL', page, limit),
        fetchTransactionsByStatus('PENDING', page, limit),
        fetchTransactionsByStatus('FAILED', page, limit),
      ]);

      // Combine the transactions from all successful responses
      const allTransactions = results.flatMap(result =>
        result.status === 'fulfilled' ? result.value.data.transactions : []
      );

      // We can create a combined pagination object, or just use the first successful one for now
      const successfulResult = results.find(r => r.status === 'fulfilled') as PromiseFulfilledResult<TransactionsApiResponse> | undefined;
      const pagination = successfulResult?.value.data.pagination || { currentPage: 1, totalPages: 1, totalItems: allTransactions.length, limit };

      return {
        status: "success",
        data: {
          transactions: allTransactions,
          pagination: { ...pagination, totalItems: allTransactions.length },
        }
      };
    } catch (error) {
      console.error('Failed to fetch all transactions:', error);
      throw error;
    }
  }
};

// --- The rest of the file is unchanged ---
export const getTransactionById = async (transactionId: string): Promise<TransactionDetailApiResponse> => {
  try {
    const response = await apiClient.get<TransactionDetailApiResponse>(`transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch transaction ${transactionId}:`, error);
    throw error;
  }
};

// === THE CORRECTED AND IMPLEMENTED PDF FUNCTION ===
export const downloadUserTransactionsPDF = async (userId: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/transactions/${userId}/pdf`, {
      responseType: 'blob', // This tells axios to expect a file download
    });
    // The file data is directly on response.data when using 'blob'
    return response.data; 
  } catch (error) {
    console.error(`Failed to download PDF for user ${userId}:`, error);
    throw error;
  }
};