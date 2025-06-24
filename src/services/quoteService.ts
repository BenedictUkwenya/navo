// src/services/quoteService.ts
import apiClient from './apiClient';
import { QuotesApiResponse } from '../types/quote';

const QUOTES_PATH = 'quotes'; // Relative to /api/v1/

/**
 * Fetches a paginated list of all quote requests.
 */
export const getQuotes = async (page = 1, limit = 8): Promise<QuotesApiResponse> => {
  try {
    const response = await apiClient.get<QuotesApiResponse>(QUOTES_PATH, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    throw error;
  }
};

/**
 * Deletes a specific quote by its ID.
 */
export const deleteQuote = async (quoteId: string): Promise<void> => {
    try {
        // The API returns 204 No Content on success, so the response will be empty.
        await apiClient.delete(`${QUOTES_PATH}/${quoteId}`);
    } catch (error) {
        console.error(`Failed to delete quote ${quoteId}:`, error);
        throw error;
    }
};