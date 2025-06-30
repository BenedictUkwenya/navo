// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Assuming apiClient is exported as default

// Define the shape of the user object
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string; // The profile picture URL
}

// Define what our context will provide
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));

  const fetchUserProfile = async () => {
    try {
      // Assuming you have a /profile endpoint to get user data
      const response = await apiClient.get('/profile/get-profile'); 
      setUser(response.data.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      // If fetching fails, log the user out
      logout();
    }
  };
  
  // On initial load, check for a token and fetch the user profile
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    await fetchUserProfile(); // Fetch profile immediately after login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login'; // Force a redirect to clear all state
  };

  const value = { user, setUser, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};