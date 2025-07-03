import apiClient from './apiClient';
import { Product, ProductApiResponse } from '../types/product';

const PRODUCTS_PATH = 'products';

// Fetches all products
export const getAllProducts = async (): Promise<ProductApiResponse> => {
  try {
    const response = await apiClient.get<ProductApiResponse>(`${PRODUCTS_PATH}/all`);
    return response.data;
  } catch (error) { console.error('Failed to fetch products:', error); throw error; }
};

// Creates a new product
export const createProduct = async (productData: FormData): Promise<Product> => {
  try {
    // The endpoint to create is typically just the base resource path with a POST
    const response = await apiClient.post<Product>(PRODUCTS_PATH, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) { 
    console.error('Failed to create product:', error); 
    throw error; 
  }
};

// Updates the status of a product
export const updateProductStatus = async (productId: string, newStatus: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`${PRODUCTS_PATH}/update-status`, { productId, newStatus });
    return response.data;
  } catch (error) { console.error('Failed to update product status:', error); throw error; }
};

// Deletes a product by its ID
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await apiClient.post(`${PRODUCTS_PATH}/${productId}`);
  } catch (error) { console.error('Failed to delete product:', error); throw error; }
};