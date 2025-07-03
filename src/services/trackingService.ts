// src/services/trackingService.ts
import apiClient from './apiClient';
import { TrackingsApiResponse } from '../types/tracking';

const TRACKINGS_PATH = 'trackings';

export const getTrackings = async (): Promise<TrackingsApiResponse> => {
  try {
    const response = await apiClient.get<TrackingsApiResponse>(TRACKINGS_PATH);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trackings:', error);
    throw error;
  }
};

export const deleteTrackingById = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${TRACKINGS_PATH}/${id}`);
  } catch (error) {
    console.error(`Failed to delete tracking with id ${id}:`, error);
    throw error;
  }
};