import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import the hook for navigation
import './LoginPage.css';

// Here is the placeholder path for the eye icon.
import eyeIcon from '../../assets/images/loginpageye.png'; 

const LoginPage: React.FC = () => {
  // State for the form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Hook from React Router to programmatically navigate
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to handle form submission
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default browser action of reloading the page
    event.preventDefault();

    // --- MOCK LOGIN LOGIC ---
    // In a real app, you would make an API call here with the email and password.
    // For now, we'll just log it and assume the login is successful.
    console.log('Attempting to log in with:', { email, password });

    // If the API call is successful, do the following:
    // 1. Set the authentication flag in localStorage. This is what our ProtectedRoute checks.
    localStorage.setItem('isAuthenticated', 'true');

    // 2. Navigate the user to the dashboard or the main page of the app.
    navigate('/dashboard'); 
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <div className="login-header">
          <p>Welcome back!</p>
          <h1>Login</h1>
        </div>

        {/* We attach our handleLogin function to the form's onSubmit event */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter here"
              value={email} // Bind the input's value to our state
              onChange={(e) => setEmail(e.target.value)} // Update state on every keystroke
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
                value={password} // Bind the input's value to our state
                onChange={(e) => setPassword(e.target.value)} // Update state on every keystroke
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

          <div className="forgot-password-container">
            {/* In the future, this could be a <Link> from react-router-dom to a forgot password page */}
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