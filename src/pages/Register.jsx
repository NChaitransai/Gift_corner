import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await register(name, email, password);
      navigate('/login', { state: { registered: true, email } });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 1.5rem' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Join GiftCorner and start personalizing gifts</p>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(230, 57, 70, 0.1)', border: '1px solid var(--color-danger)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', color: 'white', fontSize: '0.875rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
          </div>

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

          <div className="form-group">
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

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating Account...' : 'Register'}
            <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
