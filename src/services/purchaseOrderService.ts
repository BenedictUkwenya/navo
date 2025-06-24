// src/services/purchaseOrderService.ts

import apiClient from './apiClient';
import { OrdersApiResponse, OrderDetailApiResponse } from '../types/order';

// Define the paths relative to your apiClient's baseURL
const ORDERS_PATH = 'orders'; // e.g., will become .../api/v1/orders

/**
 * Fetches a paginated list of all purchase orders.
 * @param page - The page number to fetch.
 * @param limit - The number of items per page.
 * @returns A promise that resolves to the API response containing orders and pagination info.
 */
export const getOrders = async (page = 1, limit = 10): Promise<OrdersApiResponse> => {
  try {
    const response = await apiClient.get<OrdersApiResponse>(ORDERS_PATH, {
      params: { page, limit }
    });
    // The API response nests the data, so we return the whole object
    // to let the component access both `data.allOrders` and `data.pagination`.
    return response.data;
  } catch (error) {
    console.error('Failed to fetch purchase orders:', error);
    // Re-throw the error so the calling component can handle it (e.g., show an error message)
    throw error;
  }
};

/**
 * Fetches the complete details for a single purchase order by its ID.
 * @param orderId - The unique identifier of the order to fetch.
 * @returns A promise that resolves to the API response containing the detailed order object.
 */
export const getOrderById = async (orderId: string): Promise<OrderDetailApiResponse> => {
  try {
    // Construct the URL, e.g., /orders/order123
    const response = await apiClient.get<OrderDetailApiResponse>(`${ORDERS_PATH}/${orderId}`);
    // The API response nests the data, so we return the whole object
    // to let the component access `data.order`.
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for order ID ${orderId}:`, error);
    throw error;
  }
};