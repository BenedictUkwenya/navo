// src/services/authService.ts

import apiClient from './apiClient';

// This interface defines the expected shape of the user's login details
interface LoginCredentials {
  email: string;
  password: string;
}

// This interface defines the expected shape of the data inside a successful API response
interface LoginResponseData {
  message: string;
  accessToken: string;
  // The API might send other data, but we only care about accessToken
}

/**
 * Logs in a user by sending credentials to the API.
 * @param credentials The user's email and password.
 * @returns A promise that resolves to the authentication token (string).
 * @throws An error if the login fails or the token is not found.
 */
export const login = async (credentials: LoginCredentials): Promise<string> => {
  console.log('[authService] Starting login process...');

  try {
    // Make the API call to the /admin/login endpoint
    const response = await apiClient.post<LoginResponseData>('/admin/login', credentials);
    
    console.log('[authService] Received successful API response:', response.data);

    // Securely extract the token from the response data
    const token = response.data.accessToken;
    
    // Check if the token is a valid, non-empty string
    if (typeof token === 'string' && token.length > 0) {
      console.log('[authService] Token found, returning it.');
      return token;
    } else {
      // If the token is missing or invalid, it's a critical error
      console.error('[authService] ERROR: Login was successful, but "accessToken" was missing or invalid in the server response.');
      throw new Error('Server response did not include a valid token.');
    }

  } catch (error) {
    // If the API call itself fails (e.g., network error, 401/500 status)
    console.error('[authService] ERROR: The API call failed.', error);
    // Re-throw the error so the LoginPage can catch it and display a message
    throw error;
  }
};