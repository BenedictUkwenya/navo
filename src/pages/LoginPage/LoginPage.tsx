import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import the hook for navigation
import './LoginPage.css';

 
import eyeIcon from '../../assets/images/loginpageye.png'; 

const LoginPage: React.FC = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
  const [passwordVisible, setPasswordVisible] = useState(false);

 
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
     
    event.preventDefault();

 
    console.log('Attempting to log in with:', { email, password });

    localStorage.setItem('isAuthenticated', 'true');

     
    navigate('/dashboard'); 
  };

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