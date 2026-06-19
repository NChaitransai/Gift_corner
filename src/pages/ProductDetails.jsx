import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { productAPI } from '../services/api';
import { addToCart } from '../redux/cartSlice';
import { Star, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Product not found or database error.');
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (val) => {
    setQuantity(Math.max(1, quantity + val));
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    );

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--color-primary)' }}>
        <div className="font-serif" style={{ fontSize: '1.5rem' }}>Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} className="nav-link">
        <ArrowLeft size={16} />
        Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        {/* Product Image Column */}
        <div>
          <div className="glass" style={{ overflow: 'hidden', borderRadius: '24px', padding: '0.5rem' }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', borderRadius: '20px', display: 'block', maxHeight: '450px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Product Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', trackingLetter: '0.1em' }}>
              {product.category}
            </span>
            <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.25rem 0 0.5rem 0', lineHeight: '1.2' }}>{product.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(product.price)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-secondary)' }}>
                <Star size={18} fill="var(--color-secondary)" style={{ color: 'var(--color-secondary)' }} />
                {product.rating} / 5 Rating
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>{product.description}</p>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-glass)' }} />

          {/* Add to Cart Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-glass)', borderRadius: '9999px', padding: '0.25rem' }}>
              <button
                onClick={() => handleQuantityChange(-1)}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}
              >
                -
              </button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '1.1rem' }}>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flexGrow: 1, padding: '0.85rem', gap: '0.75rem' }}
            >
              <ShoppingCart size={20} />
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="toast-msg">
          <div style={{ backgroundColor: 'var(--color-primary)', display: 'flex', padding: '0.25rem', borderRadius: '50%', color: '#07050f' }}>
            <Check size={16} strokeWidth={3} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Added to Cart!</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Explore other items or <Link to="/cart" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>view cart</Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
