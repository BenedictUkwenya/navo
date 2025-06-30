// src/services/customerService.ts
import apiClient from './apiClient';
import { CustomerApiResponse, CustomerDetailApiResponse } from '../types/customer';

export const getCustomers = async (page = 1, limit = 9): Promise<CustomerApiResponse> => {
  try {
    const response = await apiClient.get<CustomerApiResponse>('/customers', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};

// === THE CORRECTED FUNCTION ===
export const getCustomerById = async (id: string): Promise<CustomerDetailApiResponse> => {
  try {
    const response = await apiClient.get<CustomerDetailApiResponse>(`/customers/${id}`);
    // The API returns the { customer: ... } object directly in response.data
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer with id ${id}:`, error);
    throw error;
  }
};