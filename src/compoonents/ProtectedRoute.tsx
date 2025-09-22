import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { checkTokenExpiration } from "../utils/tokenUtils";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Initial token check
    if (!checkTokenExpiration()) {
      return;
    }

    // Check token every minute
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
  }, [accessToken]);

  // Use checkTokenExpiration for route protection
  if (!isAuthenticated || !accessToken || !checkTokenExpiration()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
