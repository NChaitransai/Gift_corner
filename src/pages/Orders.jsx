import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        const response = await orderAPI.getUserOrders(user.id);
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sorted);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--color-primary)' }}>
        <div className="font-serif" style={{ fontSize: '1.5rem' }}>Loading order history...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <Box size={48} />
        </div>
        <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>No Placed Orders Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You haven't checked out any gifts yet.</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Explore Gifts Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} className="nav-link">
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>
        <h1 className="section-title">Order History</h1>
        <p className="section-subtitle">View status and details of your purchased gifts.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {orders.map((order) => {
          const isDelivered = (new Date() - new Date(order.date)) > 48 * 36e5;
          return (
            <div key={order.id} className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
              {/* Order Header info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ORDER PLACED</p>
                  <p style={{ fontWeight: 600 }}>{new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>TOTAL VALUE</p>
                  <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(order.total)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>STATUS</p>
                  <p style={{ fontWeight: 700, color: isDelivered ? 'var(--color-success)' : 'var(--color-secondary)' }}>
                    {isDelivered ? 'Delivered' : 'In Transit'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>ORDER REFERENCE</p>
                  <p style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>#{order.id}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {/* Placed Items & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h4 className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Gifts List</h4>
                  {order.items.map((item) => (
                    <div key={item.cartItemId || item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                      <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.title} x {item.quantity}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>Delivery Address:</p>
                  <p>{order.shippingDetails.name} ({order.shippingDetails.phone})</p>
                  <p>{order.shippingDetails.address}, {order.shippingDetails.city} - {order.shippingDetails.zip}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
