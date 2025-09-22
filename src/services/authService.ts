import apiClient from "./apiClient";

// This interface defines the expected shape of the user's login details
interface LoginCredentials {
  email: string;
  password: string;
}

// This interface defines the expected shape of the admin user data
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// This interface defines the expected shape of the data inside a successful API response
interface LoginResponseData {
  message: string;
  accessToken: string;
  refreshToken: string;
  admin: AdminUser;
}

/**
 * Logs in a user by sending credentials to the API.
 * @param credentials The user's email and password.
 * @returns A promise that resolves to the complete login response data.
 * @throws An error if the login fails or the response is invalid.
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponseData> => {
  console.log("[authService] Starting login process...");

  try {
    // Make the API call to the /admin/login endpoint
    const response = await apiClient.post<LoginResponseData>(
      "/admin/login",
      credentials
    );

    console.log(
      "[authService] Received successful API response:",
      response.data
    );

    // Validate the response data
    const { accessToken, refreshToken, admin } = response.data;

    // Check if all required fields are present
    if (!accessToken || !refreshToken || !admin) {
      console.error(
        "[authService] ERROR: Login response missing required fields"
      );
      throw new Error("Server response incomplete or invalid");
    }

    // Return the complete response data
    return response.data;
  } catch (error) {
    // If the API call itself fails (e.g., network error, 401/500 status)
    console.error("[authService] ERROR: The API call failed.", error);
    // Re-throw the error so the LoginPage can catch it and display a message
    throw error;
  }
};
