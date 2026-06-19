import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { CreditCard, Truck, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const { user } = useAuth();

  // Shipping Form State
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Order Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const shippingCost = subtotal >= 1500 ? 0 : 99;
  const totalAmount = subtotal + shippingCost;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingName || !phone || !address || !city || !zip || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all shipping and payment details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user ? user.id : 'guest',
        items: cartItems,
        shippingDetails: {
          name: shippingName,
          phone,
          address,
          city,
          zip,
        },
        total: totalAmount,
        date: new Date().toISOString(),
      };

      const response = await orderAPI.create(orderData);
      setCreatedOrderId(response.data.id);
      dispatch(clearCart());
      setOrderSuccess(true);
    } catch {
      alert('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully created, show confirmation
  if (orderSuccess) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(46, 196, 182, 0.1)', color: 'var(--color-success)', marginBottom: '1.5rem' }}>
          <CheckCircle size={56} />
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
          Thank you for shopping with us. Your gifts are being prepared for dispatch.
        </p>

        {/* Mock Email Notification Notification */}
        <div className="success-message form-message" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', textStyle: 'left', maxWidth: '560px' }}>
          <span style={{ fontSize: '0.95rem' }}>
            📧 A secure invoice and order confirmation receipt have been sent to <strong>{user?.email || 'your email'}</strong>!
          </span>
        </div>

        <div>
          <div className="glass" style={{ display: 'inline-block', padding: '1rem 2rem', marginBottom: '2.5rem', borderColor: 'var(--border-glass-active)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Order Reference ID:</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
              #{createdOrderId}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/orders" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
            Track Your Order
          </Link>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty, redirect back
  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <Link to="/products" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} className="nav-link">
        <ArrowLeft size={16} />
        Back to Shopping Cart
      </Link>

      <h1 className="section-title">Secure Checkout</h1>

      <form className="checkout-layout" onSubmit={handlePlaceOrder} style={{ display: 'grid', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Shipping & Payment Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Shipping Form */}
          <div className="glass" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <Truck size={20} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600 }}>1. Shipping Information</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="123 Creative Lane"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP / Postal Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="94103"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="glass" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <CreditCard size={20} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600 }}>2. Payment Details</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="4111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVV / CVC</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Box */}
        <div className="glass" style={{ padding: '1.75rem', position: 'sticky', top: '6rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Your Order
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                <div style={{ maxWidth: '75%' }}>
                  <p style={{ fontWeight: 600 }}>{item.title} x {item.quantity}</p>

                </div>
                <span style={{ fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border-glass)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', gap: '0.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing Order...
              </>
            ) : (
              <>
                Confirm & Place Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
