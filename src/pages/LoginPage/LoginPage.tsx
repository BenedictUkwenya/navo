import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { login } from '../../services/authService'; // <-- IMPORT our new login function

import eyeIcon from '../../assets/images/loginpageye.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // === NEW STATE FOR HANDLING API CALLS ===
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // ==========================================
  
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // === THE UPDATED handleLogin FUNCTION ===
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);    // Clear previous errors on a new attempt
    setLoading(true);  // Set loading to true to disable the button

    try {
      // Call the login service with the credentials from the form
      const token = await login({ email, password });

      // If successful, save the token to localStorage
      // Our apiClient will automatically use this for future requests
      localStorage.setItem('authToken', token);

      // This is for our simple route guard
      localStorage.setItem('isAuthenticated', 'true');

      // Navigate to the dashboard, replacing the login page in history
      navigate('/dashboard', { replace: true });

    } catch (err) {
      // If the API call fails, catch the error and display a message
      setError('Invalid email or password. Please try again.');
      console.error(err);
    } finally {
      // Whether it succeeds or fails, stop the loading state
      setLoading(false);
    }
  };
  // =========================================

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
                type={passwordVisible ? 'text' : 'password'}
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
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          
          {/* Display the error message if one exists */}
          {error && <p className="login-error-message">{error}</p>}

          <div className="forgot-password-container">
            <a href="#">Forgot password?</a>
          </div>

          {/* Disable the button and change text while loading */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;