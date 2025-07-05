// src/pages/LoginPage/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Assuming your styles are here
import { login as loginService } from '../../services/authService';
import eyeIcon from '../../assets/images/loginpageye.png'; // Make sure this path is correct

const LoginPage: React.FC = () => {
  // State for form inputs
  const [email, setEmail] = useState('superadmin@loxford.com');
  const [password, setPassword] = useState('');
  
  // State for UI feedback
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // React Router's navigation hook
  const navigate = useNavigate();

  /**
   * Handles the form submission when the user clicks the "Login" button.
   */
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default browser form submission
    setError(null); // Clear any previous errors
    setLoading(true); // Show a loading state on the button

    console.log('[LoginPage] Login button clicked. Calling authService...');

    try {
      // Call our robust login service and wait for the token
      const token = await loginService({ email, password });

      console.log('[LoginPage] Successfully received token from authService:', token);
      
      // If the code reaches here, it means the login was successful and we have a valid token.
      
      // 1. Save the token to the browser's local storage for future API calls
      localStorage.setItem('authToken', token);
      console.log('[LoginPage] Token saved to localStorage.');

      // 2. Redirect the user to the main dashboard
      console.log('[LoginPage] Redirecting to /dashboard...');
      navigate('/dashboard', { replace: true });

    } catch (err) {
      // If `loginService` throws any error, we will catch it here.
      console.error('[LoginPage] Login failed. Error caught:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      // This block runs whether the login succeeded or failed
      setLoading(false); // Hide the loading state on the button
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
              type="email" id="email" placeholder="Enter here"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={passwordVisible ? 'text' : 'password'} id="password" placeholder="Enter here"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={eyeIcon} alt="Toggle password visibility"
                className="password-toggle-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <div className="forgot-password-container"><a href="#">Forgot password?</a></div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;