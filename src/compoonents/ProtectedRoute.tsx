// src/compoonents/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check directly for the token in localStorage.
  const token = localStorage.getItem('authToken');

  console.log('[ProtectedRoute] Checking for token. Found:', !!token);

  // If a token exists, render the child component (e.g., the Dashboard).
  // The <Outlet /> represents the child route.
  if (token) {
    return <Outlet />;
  }

  // If no token, redirect to the login page.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;