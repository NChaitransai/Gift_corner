import { Link } from 'react-router-dom';
import { Gift, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer animate-fade-in">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-logo" style={{ marginBottom: '1rem' }}>
              <Gift size={24} style={{ color: 'var(--color-primary)' }} />
              <span>GiftCorner</span>
            </div>
            <p style={{ maxWidth: '360px', marginBottom: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Your ultimate destination for beautifully customized and engraved gifts. We bring your special moments to life with high-quality custom engravings, prints, and embroideries.
            </p>
          </div>
          <div>
            <h3 className="font-serif" style={{ color: 'var(--color-text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/" style={{ color: 'var(--color-text-muted)' }} className="nav-link">Home</Link></li>
              <li><Link to="/products" style={{ color: 'var(--color-text-muted)' }} className="nav-link">Gifts Shop</Link></li>
              <li><Link to="/cart" style={{ color: 'var(--color-text-muted)' }} className="nav-link">Shopping Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif" style={{ color: 'var(--color-text-main)', marginBottom: '1rem', fontSize: '1.1rem' }}>Customer Support</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Email: support@giftcorner.com</p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Phone: +1 (555) 019-2834</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Hours: Mon - Fri, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p>© {new Date().getFullYear()} GiftCorner. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Made with <Heart size={14} fill="var(--color-primary)" color="var(--color-primary)" /> for your special moments
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
