import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid username or password');
      }
    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 className="auth-card-title">Sign In</h2>
        <p className="auth-card-desc">Enter your credentials to access the portal</p>
      </div>

      {error && (
        <div className="auth-alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Username or Email</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-input-icon" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="auth-input"
              autoComplete="username"
            />
          </div>
        </div>

        <div className="auth-form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
            <span style={{ fontSize: '0.78rem', color: '#6366f1', cursor: 'pointer', fontWeight: 500 }} onClick={() => handleFillDemo('admin', 'Admin@123')}>
              Forgot password?
            </span>
          </div>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !username.trim() || !password.trim()} 
          className="auth-btn-primary"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Quick-Fill Widget */}
      <div className="auth-demo-box">
        <div className="auth-demo-box-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="#f59e0b" />
            Demo Credentials
          </span>
          <button 
            type="button" 
            className="auth-demo-badge" 
            onClick={() => handleFillDemo('admin', 'Admin@123')}
          >
            Auto-fill
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
          <span>User: <strong>admin</strong></span>
          <span>Pass: <strong>Admin@123</strong></span>
        </div>
      </div>

      <div className="auth-footer-link">
        Don't have an account? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
};

export default Login;

