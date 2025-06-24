// src/services/quoteService.ts

import apiClient from './apiClient';
import { QuotesApiResponse } from '../types/quote';

const QUOTES_PATH = 'quotes';

export const getQuotes = async (page = 1, limit = 8): Promise<QuotesApiResponse> => {
  try {
    // Make the API call and expect the full response structure
    const response = await apiClient.get<QuotesApiResponse>(QUOTES_PATH, {
      params: { page, limit }
    });
    // === THIS IS THE FIX ===
    // The component needs the full response object to get `totalPages`, etc.
    // So, we return response.data directly.
    return response.data;
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    throw error;
  }
};

export const deleteQuote = async (quoteId: string): Promise<void> => {
    // ... no changes needed here ...
};