import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../redux/productSlice';
import { Truck, Sparkles, Clock, ArrowRight, Star } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="container animate-fade-in">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(226, 149, 120, 0.1)', padding: '0.5rem 1.25rem', borderRadius: '9999px', color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            <Sparkles size={16} />
            <span> Personalized Gift Collection</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: 700 }}>
            Gifts Crafted with Love, <br />
            <span style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Personalized for You
            </span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Transform ordinary moments into extraordinary memories. Explore our handpicked collection of high-quality frames, accessories, mugs, and romantic flower boxes perfect for any occasion.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Explore Gifts Shop
              <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=Romantic" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Shop Romantic Gifts
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title">Popular Creations</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Discover what other shoppers are personalizing for their loved ones.</p>
          </div>
          <Link to="/products" style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="nav-link">
            View All Store Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {status === 'loading' ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-primary)' }}>Loading Featured Items...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
            {featuredProducts.map((product) => (
              <div key={product.id} className="glass" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(7, 5, 15, 0.75)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                    {product.category}
                  </span>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: '1.4' }}>{product.title}</h3>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(product.price)}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.6' }}>
                    {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                      <Star size={16} fill="var(--color-secondary)" style={{ color: 'var(--color-secondary)' }} />
                      {product.rating} / 5
                    </span>
                    <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(226, 149, 120, 0.1)', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>Premium Curated Quality</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>We source and craft only the finest materials, ensuring a premium feel and lasting finish for every item.</p>
        </div>

        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(233, 196, 106, 0.1)', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
            <Truck size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>Free Secure Shipping</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Enjoy free, tracked shipping on orders over ₹1,500. Carefully packaged to arrive in perfect condition.</p>
        </div>

        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(46, 196, 182, 0.1)', color: 'var(--color-success)', marginBottom: '1.25rem' }}>
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>Rapid Order Dispatch</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Each gift set is carefully inspected and dispatched within 24-48 hours by our packaging and logistics team.</p>
        </div>
      </section>

      {/* Brand CTA banner */}
      <section className="glass" style={{ padding: '3.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(20, 17, 36, 0.9) 0%, rgba(30, 20, 50, 0.9) 100%)', border: '1px solid var(--border-glass-active)', borderRadius: '24px' }}>
        <h2 className="font-serif" style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: 700 }}>Looking for the Perfect Gift?</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Explore our wide product catalog of curated gift items and find the best match for birthdays, anniversaries, corporate celebrations, or personal surprises.
        </p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 2.25rem' }}>
          Browse Full Catalog
        </Link>
      </section>
    </div>
  );
};

export default Home;
