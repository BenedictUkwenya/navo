import apiClient from './apiClient';
import { ShipmentRate } from '../types/shipmentPricing';

// === THE FIX: Define the full, explicit paths relative to the baseURL ===
// This removes any ambiguity about slashes or concatenation.
const CREATE_RATE_PATH = 'shipments/create-rate';
const UPDATE_RATE_PATH = 'shipments/update-rate';
// =====================================================================

type RatePayload = Omit<ShipmentRate, 'id' | 'createdAt' | 'updatedAt'>;

export const createShipmentRate = async (rateData: RatePayload): Promise<any> => {
  try {
    // Use the explicit path constant
    const response = await apiClient.post(CREATE_RATE_PATH, rateData);
    return response.data;
  } catch (error) {
    console.error('Failed to create shipment rate:', error);
    throw error;
  }
};

export const updateShipmentRate = async (rateData: RatePayload): Promise<any> => {
  try {
    // Use the explicit path constant
    const response = await apiClient.patch(UPDATE_RATE_PATH, rateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update shipment rate:', error);
    throw error;
  }
};