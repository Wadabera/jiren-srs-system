import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('If the email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-left animate-fade-in">
        <div className="brand-section">
          <div className="logo-icon">
            <GraduationCap size={48} />
          </div>
          <h1>Password Reset</h1>
          <p>Enter your email to receive a password reset link.</p>
        </div>
      </div>
      
      <div className="login-right">
        <Link to="/login" className="back-link">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        
        <div className="login-form-box animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="form-header">
            <h2>Reset Password</h2>
            <p>We'll send you a reset link</p>
          </div>
          
          {status && (
            <div className="error-alert" style={{ background: 'var(--success)', border: 'none' }}>
              <AlertCircle size={18} />
              <span>{status}</span>
            </div>
          )}
          
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}