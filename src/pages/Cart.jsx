import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCartAsync, updateQuantityAsync, clearCartAsync } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import CartItem from '../components/CartItem';

const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);

  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleQtyChange = (cartItemId, currentQty, amount) => {
    dispatch(updateQuantityAsync({ userId: user?.id, cartItemId, quantity: currentQty + amount }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCartAsync({ userId: user?.id, cartItemId }));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      dispatch(clearCartAsync(user?.id));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <ShoppingBag size={48} />
        </div>
        <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You haven't added any gifts to your cart yet.</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Browse Gifts Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Shopping Cart</h1>
        <button onClick={handleClear} className="btn-text" style={{ fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
          Clear All Items
        </button>
      </div>

      <div className="cart-layout" style={{ display: 'grid', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cartItems.map((item) => (
            <CartItem
              key={item.cartItemId}
              item={item}
              onQtyChange={handleQtyChange}
              onRemove={handleRemove}
            />
          ))}

          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }} className="nav-link">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Checkout Summary Box */}
        <div className="glass" style={{ padding: '1.75rem', position: 'sticky', top: '6rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '-0.25rem' }}>
                Add {formatPrice(1500 - subtotal)} more for FREE shipping!
              </span>
            )}
            <hr style={{ border: 0, borderTop: '1px solid var(--border-glass)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', gap: '0.5rem' }}>
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
