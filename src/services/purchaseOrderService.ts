// src/services/purchaseOrderService.ts
import apiClient from './apiClient';
import { OrdersApiResponse, OrderDetailApiResponse } from '../types/order';

const ORDERS_PATH = 'orders';

export const getOrders = async (page = 1, limit = 10): Promise<OrdersApiResponse> => {
  try {
    const response = await apiClient.get<OrdersApiResponse>(ORDERS_PATH, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch purchase orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<OrderDetailApiResponse> => {
  try {
    const response = await apiClient.get<OrderDetailApiResponse>(`${ORDERS_PATH}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for order ID ${orderId}:`, error);
    throw error;
  }
};