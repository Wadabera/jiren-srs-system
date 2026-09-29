import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import DemoAccountPicker, { DEMO_ACCOUNTS } from '../components/DemoAccountPicker';
import './Login.css';

const DEMO_PASSWORD = 'Demo@1234';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const { login } = useAuth();

  // Fills the form from the demo picker and signs straight in, so a demo can
  // go from landing page to a populated dashboard in one click.
  const handleDemoLogin = async (demoUsername) => {
    setError('');
    setUsername(demoUsername);
    setPassword(DEMO_PASSWORD);
    setIsLoading(true);
    const result = await login(demoUsername, DEMO_PASSWORD);
    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left animate-fade-in">
        <div className="brand-section">
          <div className="logo-icon">
            <GraduationCap size={48} />
          </div>
          <h1>Student Registration System</h1>
          <p>Streamlining academic management with secure, efficient student administration tools.</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <span>Secure & Encrypted</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Fast Processing</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <span>User Friendly</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-box animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to access your account</p>
          </div>
          
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>
            
            <button type="submit" className="btn btn-primary btn-submit" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Log In'}
            </button>
          </form>
          
          <button
            type="button"
            className="demo-toggle"
            onClick={() => setShowDemo(v => !v)}
            aria-expanded={showDemo}
          >
            {showDemo ? 'Hide' : 'Show'} demo accounts
          </button>

          {showDemo && (
            <DemoAccountPicker onPick={handleDemoLogin} disabled={isLoading} />
          )}

          <div className="login-footer">
            <p className="demo-hint">
              Accounts are created by the school director. Contact the front office if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}