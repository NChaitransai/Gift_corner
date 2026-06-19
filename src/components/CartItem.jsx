import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const CartItem = ({ item, onQtyChange, onRemove }) => {
  return (
    <div className="glass" style={{ display: 'flex', padding: '1.25rem', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <img
        src={item.image}
        alt={item.title}
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
      />
      <div style={{ flex: '1 1 200px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</h3>
      </div>

      {/* Price & Quantity Control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary)', minWidth: '70px', textAlign: 'right' }}>
          {formatPrice(item.price * item.quantity)}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-glass)', borderRadius: '9999px', padding: '0.15rem' }}>
          <button
            onClick={() => onQtyChange(item.cartItemId, item.quantity, -1)}
            disabled={item.quantity <= 1}
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-muted)' }}
          >
            -
          </button>
          <span style={{ width: '30px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>{item.quantity}</span>
          <button
            onClick={() => onQtyChange(item.cartItemId, item.quantity, 1)}
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-muted)' }}
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item.cartItemId)}
          style={{ color: 'var(--color-danger)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(230, 57, 70, 0.05)' }}
          className="nav-link"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
