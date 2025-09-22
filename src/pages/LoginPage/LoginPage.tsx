// src/pages/LoginPage/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Assuming your styles are here
import { login as loginService } from "../../services/authService";
import { login as loginAction } from "../../redux/authSlice";
import eyeIcon from "../../assets/images/loginpageye.png"; // Make sure this path is correct
import { useDispatch } from "react-redux";

const LoginPage: React.FC = () => {
  // State for form inputs
  const [email, setEmail] = useState("superadmin@loxford.com");
  const [password, setPassword] = useState("");

  // State for UI feedback
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React Router's navigation hook
  const navigate = useNavigate();

  /**
   * Handles the form submission when the user clicks the "Login" button.
   */
  const dispatch = useDispatch();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    console.log("[LoginPage] Login button clicked. Calling authService...");

    try {
      // Get complete response from login service
      const response = await loginService({ email, password });
      const { accessToken, refreshToken, admin } = response;

      // Get token expiration from JWT
      const tokenData = JSON.parse(atob(accessToken.split(".")[1]));

      // Dispatch to Redux store
      dispatch(
        loginAction({
          accessToken,
          refreshToken,
          user: admin,
          exp: tokenData.exp,
        })
      );

      console.log("[LoginPage] Login successful, redirecting...");
      window.location.href = "/dashboard"; // Force page reload to ensure Redux state is applied
    } catch (err) {
      console.error("[LoginPage] Login failed. Error caught:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  // The JSX for rendering the form
  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <div className="login-header">
          <p>Welcome back!</p>
          <h1>Login</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={eyeIcon}
                alt="Toggle password visibility"
                className="password-toggle-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <div className="forgot-password-container">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
