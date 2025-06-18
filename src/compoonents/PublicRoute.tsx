import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This function checks if the user is authenticated.
// It should be the same logic as in your ProtectedRoute.
const checkAuth = (): boolean => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated;
};

const PublicRoute: React.FC = () => {
  const isAuth = checkAuth();

  // If the user IS authenticated, redirect them away from the public
  // page (e.g., login) to the main dashboard.
  // If they are NOT authenticated, show the public page (e.g., login).
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;