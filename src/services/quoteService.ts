// src/services/quoteService.ts
import apiClient from './apiClient';
import { QuotesApiResponse } from '../types/quote';

const QUOTES_PATH = 'quotes';

export const getQuotes = async (page = 1, limit = 8): Promise<QuotesApiResponse> => {
  try {
    const response = await apiClient.get<QuotesApiResponse>(QUOTES_PATH, {
      params: { page, limit }
    });
    // Return the full response data, as the component needs both
    // the 'quotes' array and the 'pagination' object.
    return response.data;
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    throw error;
  }
};

// You can add other functions like deleteQuote here later