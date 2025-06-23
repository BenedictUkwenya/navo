// src/services/authService.ts
import apiClient from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

// Let's assume the response will contain the token in the data body
interface LoginResponse {
  accessToken?: string; // Using optional '?' for safety
  token?: string;       // Check for both common names
  // It might also have other properties
  [key: string]: any;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    // Make a standard JSON request. Our apiClient sets the correct Content-Type.
    const response = await apiClient.post<LoginResponse>('/admin/login', credentials);
    
    console.log('Login API response:', response);

    // Check for the token in multiple possible locations
    const token = response.data.accessToken || response.data.token;
    
    if (token) {
      return token;
    } else {
      console.log('Server response did not contain "accessToken" or "token" in the data body.', response.data);
      throw new Error('No token found in response');
    }
  } catch (error) {
    console.error('Login API call failed:', error);
    throw error;
  }
};