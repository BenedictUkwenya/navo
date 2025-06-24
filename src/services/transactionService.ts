import apiClient from './apiClient';
import { TransactionsApiResponse, TransactionDetailApiResponse } from '../types/transaction';

// This type now accepts the format the API expects ('all', 'SUCCESSFUL', etc.)
type ApiStatusFilter = 'all' | 'SUCCESSFUL' | 'PENDING' | 'FAILED';

export const getTransactions = async (
  status: ApiStatusFilter = 'all', 
  page = 1, 
  limit = 9
): Promise<TransactionsApiResponse> => {
  try {
    let path = '/transactions';
    // The API has specific endpoints for each status
    if (status !== 'all') {
      path = `/transactions/${status.toLowerCase()}`;
    }

    const response = await apiClient.get<TransactionsApiResponse>(path, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${status} transactions:`, error);
    throw error;
  }
};

export const getTransactionById = async (transactionId: string): Promise<TransactionDetailApiResponse> => {
    try {
        const response = await apiClient.get<TransactionDetailApiResponse>(`/transactions/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch transaction ${transactionId}:`, error);
        throw error;
    }
};

// --- PDF DOWNLOAD FUNCTION RESTORED ---
export const downloadUserTransactionsPDF = async (userId: string): Promise<Blob> => {
    try {
        const response = await apiClient.get(`/transactions/${userId}/pdf`, {
            responseType: 'blob', // Important for file downloads
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to download PDF for user ${userId}:`, error);
        throw error;
    }
};