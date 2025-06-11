import React, { useState } from 'react';
import './LoginPage.css';

// Here is the placeholder path for the eye icon.
// Webpack will bundle this image and provide the correct path.
import eyeIcon from '../../assets/images/loginpageye.png'; 

const LoginPage: React.FC = () => {
  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <div className="login-header">
          <p>Welcome back!</p>
          <h1>Login</h1>
        </div>

        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter here" 
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
                required
              />
              <img
                src={eyeIcon} // Use the imported icon
                alt="Toggle password visibility"
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>

          <div className="forgot-password-container">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;