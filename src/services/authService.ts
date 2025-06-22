// src/services/authService.ts
import apiClient from './apiClient';

// Define the shape of the data we need to send
interface LoginCredentials {
  email: string;
  password: string;
}

// Define the shape of the successful response data
interface LoginResponse {
  token: string;
  // It might also include user info, but the token is what we need
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    // Make the POST request to the /v1/auth/login endpoint
    // Note: apiClient already has the base URL, so we just add the path
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', credentials);
    
    // The documentation shows the token is in response.data.token
    const token = response.data.token;
    
    if (token) {
      return token;
    } else {
      throw new Error('No token found in response');
    }
  } catch (error) {
    console.error('Login API call failed:', error);
    // Re-throw the error so the component can handle it (e.g., show an alert)
    throw error;
  }
};