import apiClient from './apiClient';
import { FxRate, FxRateHistoryResponse, FxTransactionsApiResponse } from '../types/fx';

const RATE_PATH = 'rate';

// This function is correct and does not need changes.
export const getRateHistory = async (from: string, to: string): Promise<FxRateHistoryResponse> => {
  try {
    const response = await apiClient.get<FxRateHistoryResponse>(`${RATE_PATH}/history`, {
      params: {
        fromCurrency: from,
        toCurrency: to,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch FX rate history:', error);
    throw error;
  }
};

// This function is for creating NEW pairs and is also correct.
export const createRate = async (rateData: { fromCurrency: string, toCurrency: string, buyRate: number, sellRate: number }): Promise<FxRate> => {
  try {
    const response = await apiClient.post<FxRate>(`${RATE_PATH}/create`, rateData);
    return response.data;
  } catch (error) {
    console.error('Failed to create FX rate:', error);
    throw error;
  }
};


// === THIS IS THE DEFINITIVE FIX ===
// The function's type definition now correctly accepts ALL the required fields.
export const updateRate = async (rateData: { 
  id: string;
  fromCurrency: string;
  toCurrency: string;
  buyRate: number;
  sellRate: number;
}): Promise<FxRate> => {
  try {
    // We send a PATCH request to the /rate/{id} endpoint
    const { id, ...updatePayload } = rateData;
    const response = await apiClient.patch<FxRate>(`${RATE_PATH}/update-rate`, updatePayload);
    return response.data;
  } catch (error) {
    console.error(`Failed to update FX rate for id ${rateData.id}:`, error);
    throw error;
  }
};

export const getFxTransactions = async (): Promise<FxTransactionsApiResponse> => {
  try {
    const response = await apiClient.get<FxTransactionsApiResponse>(`${RATE_PATH}/all-exchanges`);
    return response.data;
  } catch (error) { console.error('Failed to fetch FX transactions:', error); throw error; }
};

// === NEW FUNCTION FOR PDF DOWNLOAD ===
// Assuming the PDF endpoint is on the /rate path
export const downloadFxTransactionsPDF = async (): Promise<Blob> => {
    try {
        const response = await apiClient.get(`${RATE_PATH}/pdf`, { // Assuming this is the endpoint
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Failed to download FX transactions PDF:', error);
        throw error;
    }
};