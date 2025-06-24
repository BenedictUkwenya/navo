// src/services/shipmentService.ts
import apiClient from './apiClient';
import { ShipmentsApiResponse, ShipmentDetailApiResponse } from '../types/shipment';

const SHIPMENTS_PATH = 'shipments';

export const getShipments = async (page = 1, limit = 9): Promise<ShipmentsApiResponse> => {
  const response = await apiClient.get<ShipmentsApiResponse>(SHIPMENTS_PATH, { params: { page, limit } });
  return response.data;
};

export const getShipmentById = async (id: string): Promise<ShipmentDetailApiResponse> => {
  const response = await apiClient.get<ShipmentDetailApiResponse>(`${SHIPMENTS_PATH}/${id}`);
  return response.data;
};