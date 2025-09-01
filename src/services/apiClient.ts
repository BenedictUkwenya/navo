// src/services/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://navoapi.viaspark.site/api/v1/", // The base URL for all API calls
  headers: {
    "Content-Type": "application/json",
    ["expo-api-key"]: process.env.REACT_APP_EXPO_API_KEY,
  },
  // timeout: 10000, // Add timeout
  // withCredentials: true,
});

// This will automatically add the login token to every request in the future

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network Error - Please check your connection or API availability"
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
