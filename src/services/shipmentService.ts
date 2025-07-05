// src/services/shipmentService.ts
import apiClient from './apiClient';
import { ShipmentsApiResponse, ShipmentDetailApiResponse, Shipment } from '../types/shipment';

const SHIPMENTS_PATH = 'shipments';

export const getShipments = async (page = 1, limit = 9): Promise<ShipmentsApiResponse> => {
  try {
    const response = await apiClient.get<ShipmentsApiResponse>(SHIPMENTS_PATH, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shipments:', error);
    throw error;
  }
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  try {
    const response = await apiClient.get<ShipmentDetailApiResponse>(`${SHIPMENTS_PATH}/${id}`);
    
    // Extract the nested shipment object and return it directly.
    // This is what the component expects.
    return response.data.data.shipment; 
    
  } catch (error) {
    console.error(`Failed to fetch shipment with id ${id}:`, error);
    throw error;
  }
};