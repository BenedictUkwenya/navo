// src/services/trackingService.ts

import apiClient from './apiClient';
import { TrackingItem } from '../types/tracking';

/**
 * Interface to describe the shape of the full API response.
 * We now know the data is nested and the array is named 'filtered'.
 */
interface TrackingsApiResponse {
  status: string;
  data: {
    filtered: TrackingItem[];
  };
}

/**
 * Fetches all tracking entries from the API.
 * @returns A promise that resolves to an array of tracking items.
 */
export const getTrackings = async (): Promise<TrackingItem[]> => {
  try {
    const response = await apiClient.get<TrackingsApiResponse>('/trackings');
    
    // === THIS IS THE FINAL, CORRECT FIX ===
    // We drill down into response.data.data and access the 'filtered' array.
    return response.data.data.filtered || [];
    
  } catch (error) {
    console.error('Failed to fetch trackings:', error);
    throw error;
  }
};

/**
 * Deletes a tracking entry by its ID.
 * @param id - The unique identifier of the tracking entry to delete.
 */
export const deleteTrackingById = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/trackings/${id}`);
    } catch (error) {
        console.error(`Failed to delete tracking with id ${id}:`, error);
        throw error;
    }
};