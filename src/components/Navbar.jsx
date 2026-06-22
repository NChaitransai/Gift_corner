import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { selectCartCount, syncCartOnLogin, clearCart } from '../redux/cartSlice';
import { Gift, ShoppingBag, LogOut, Search, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(syncCartOnLogin(user.id));
    }
  }, [user?.id, dispatch]);

  const handleLogout = () => {
    logout();
    dispatch(clearCart());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="container navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
        
        {/* Left Side: Logo only */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', flexShrink: 0 }}>
          <Gift size={28} style={{ color: 'var(--color-primary)' }} />
          <span style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.65rem', 
            fontWeight: 700, 
            color: 'var(--color-primary)',
            letterSpacing: '-0.01em'
          }}>GiftCorner</span>
        </Link>

        {/* Right Side: Search bar, Home, Gifts Shop, Cart, and Sign In grouped together */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Search Bar inside the right-hand group */}
          <form onSubmit={handleSearchSubmit} style={{ alignItems: 'center', position: 'relative', width: '200px', margin: 0 }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 1rem 0.45rem 2.4rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.9rem',
                color: 'var(--color-text-main)',
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </form>

          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{ color: isActive('/') ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 500, fontSize: '1rem' }}>
            Home
          </Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`} style={{ color: isActive('/products') ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 500, fontSize: '1rem' }}>
            Gifts Shop
          </Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isActive('/admin') ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              <Settings size={16} />
              Admin
            </Link>
          )}

          {/* Cart Icon with Overlapping Round Badge */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0.25rem', color: isActive('/cart') ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color 0.2s' }}>
            <ShoppingBag size={24} style={{ color: isActive('/cart') ? 'var(--color-primary)' : 'inherit' }} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-4px', 
                right: '-6px', 
                fontSize: '0.65rem', 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-primary)', 
                color: '#ffffff',
                fontWeight: 700
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth section: Gradient Sign In Pill */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-glass)', paddingLeft: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Hello,</span>
                <Link to="/orders" className="nav-link" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', textDecoration: 'underline' }}>
                  {user.name}
                </Link>
              </div>
              <button onClick={handleLogout} className="btn-text" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ 
              padding: '0.5rem 1.65rem', 
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '9999px',
              textTransform: 'none',
              cursor: 'pointer'
            }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
