import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const ProductCard = ({ product }) => {
  return (
    <div className="glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(7, 5, 15, 0.75)', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
          {product.category}
        </span>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: '1.4', minHeight: '2.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.title}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(product.price)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-secondary)', fontSize: '0.85rem' }}>
            <Star size={14} fill="var(--color-secondary)" style={{ color: 'var(--color-secondary)' }} />
            {product.rating}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ flexGrow: 1, padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center', gap: '0.25rem' }}>
            <Eye size={14} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
