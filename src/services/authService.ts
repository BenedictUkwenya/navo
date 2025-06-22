// src/services/authService.ts
import apiClient from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    // We are making a POST request to the /v1/auth/login endpoint
    const response = await apiClient.post<LoginResponse>(
      '/admin/login', 
      credentials,
      { // <-- START: This is the new configuration object
        headers: {
          // By changing the Content-Type, we attempt to bypass the
          // browser's preflight OPTIONS request.
          'Content-Type': 'text/plain',
        }
      }
       // <-- END: End of the new configuration object
    );
    console.log('Login API response:', response.data);
    
    // The rest of the logic remains the same.
    // If the server returns data, we check for a token.
    const token = response.data.token;
    
    if (token) {
      return token;
    } else {
      // If the login was invalid, the response might not have a token.
      // We should inspect the actual server response to be sure.
      console.log('Server response did not contain a token:', response.data);
      throw new Error('No token found in response');
    }
  } catch (error) {
    console.error('Login API call failed:', error);
    throw error;
  }
};