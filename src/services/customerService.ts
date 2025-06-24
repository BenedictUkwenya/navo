// src/services/customerService.ts
import apiClient from './apiClient';
import { CustomerApiResponse, CustomerDetailApiResponse } from '../types/customer';

// Fetches a paginated list of customers
export const getCustomers = async (page = 1, limit = 9): Promise<CustomerApiResponse> => {
  try {
    const response = await apiClient.get('/customers', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};

// Fetches the details for a single customer by their ID
export const getCustomerById = async (id: string): Promise<CustomerDetailApiResponse> => {
  try {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer with id ${id}:`, error);
    throw error;
  }
};