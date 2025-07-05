// src/compoonents/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('authToken');

  // If a token exists (meaning user is logged in), redirect them away from public pages.
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If no token, show the public page (e.g., the Login page).
  return <Outlet />;
};

export default PublicRoute;