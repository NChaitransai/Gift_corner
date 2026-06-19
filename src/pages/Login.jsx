import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 1.5rem' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sign in to continue your shopping</p>
        </div>

        {location.state?.registered && (
          <div className="form-message success-message">Registration complete. Sign in with your new account.</div>
        )}

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(230, 57, 70, 0.1)', border: '1px solid var(--color-danger)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', color: 'white', fontSize: '0.875rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <LogIn size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
