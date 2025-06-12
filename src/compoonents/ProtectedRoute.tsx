import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This function checks if the user is authenticated.
// For now, we'll check for an item in localStorage.
// Your Login.tsx should set this item upon successful login.
const checkAuth = (): boolean => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated;
};

const ProtectedRoute: React.FC = () => {
  const isAuth = checkAuth();

  // If authenticated, render the nested child component (e.g., Dashboard).
  // The <Outlet /> component from react-router-dom does this.
  // If not authenticated, redirect to the /login page.
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;