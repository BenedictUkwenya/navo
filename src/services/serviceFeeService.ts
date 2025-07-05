// src/services/serviceFeeService.ts

import apiClient from './apiClient';

// Define the shape of the Service Fee object based on your API
export interface ServiceFee {
  id: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches the current service fee from the API.
 */
export const getCurrentServiceFee = async (): Promise<ServiceFee> => {
  try {
    const response = await apiClient.get<ServiceFee>('/service-fee/current');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current service fee:', error);
    throw error;
  }
};

/**
 * Updates the service fee percentage.
 * @param percentage The new percentage value.
 */
export const updateServiceFee = async (percentage: number): Promise<ServiceFee> => {
  try {
    const payload = { percentage };
    const response = await apiClient.patch<ServiceFee>('/service-fee/update', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to update service fee:', error);
    throw error;
  }
};