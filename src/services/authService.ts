import apiClient from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

// The server isn't sending a body, so we don't need a LoginResponse interface for now.

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    const response = await apiClient.post( // No need to specify <LoginResponse>
      '/admin/login', 
      credentials
      // We are temporarily removing the text/plain hack to see if the URL fix works
    );
    
    console.log('Login API response:', response);

    // === THE FIX: Look for the token in the headers ===
    // API tokens are often returned in a header named 'Authorization' or 'x-auth-token'.
    // Let's check for 'Authorization' first.
    let token = response.headers['authorization'];

    // The token in the header often includes "Bearer ", which we need to remove.
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    
    // If it's not there, maybe it's in the data (though the log shows data is empty)
    if (!token && response.data && response.data.accessToken) {
        token = response.data.accessToken;
    }

    if (token) {
      return token;
    } else {
      console.log('Server response did not contain a token in the body or headers.');
      throw new Error('No token found in response');
    }
  } catch (error) {
    console.error('Login API call failed:', error);
    throw error;
  }
};