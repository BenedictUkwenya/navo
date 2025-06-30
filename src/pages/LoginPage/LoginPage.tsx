import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { login } from '../../services/authService'; // We just need the login service
import eyeIcon from '../../assets/images/loginpageye.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // --- THE SIMPLE, WORKING handleLogin FUNCTION ---
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Call the login service directly
      const token = await login({ email, password });

      // 2. Save the token and 'isAuthenticated' flag directly to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('isAuthenticated', 'true');

      // 3. Navigate to the dashboard
      navigate('/dashboard', { replace: true });

    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // The JSX is your original, styled version
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
            <input type="email" id="email" placeholder="Enter here" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input type={passwordVisible ? 'text' : 'password'} id="password" placeholder="Enter here" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <img src={eyeIcon} alt="Toggle password visibility" className="password-toggle-icon" onClick={togglePasswordVisibility} />
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