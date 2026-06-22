import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../redux/productSlice';
import { SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const [searchParams, setSearchParams] = useSearchParams();

  // Local filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minimumRating, setMinimumRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');

  // Categories extracted dynamically from products
  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const brands = ['All', ...new Set(products.map((p) => p.brand).filter(Boolean))];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || 'All';
    setSearchQuery(searchParam);
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesPrice = product.price <= maxPrice;
      const matchesRating = product.rating >= minimumRating;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default order
    });

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Gifts Catalog</h1>
        <p className="section-subtitle">Find the perfect gift for birthdays, anniversaries, and holidays.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Horizontal Filters Bar */}
        <aside className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', color: 'var(--color-primary)' }}>
            <SlidersHorizontal size={18} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Filter & Sort Gifts</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {/* Search filter */}
            <div>
              <label className="form-label">Search</label>
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>

            {/* Categories select */}
            <div>
              <label className="form-label">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => handleCategoryChange(e.target.value)} 
                className="form-input"
                style={{ cursor: 'pointer', backgroundColor: '#141124' }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Brand select */}
            <div>
              <label className="form-label">Brand</label>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)} 
                className="form-input"
                style={{ cursor: 'pointer', backgroundColor: '#141124' }}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Price</label>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="250"
                max="5000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-primary)',
                  background: 'rgba(255,255,255,0.1)',
                  height: '6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              />
            </div>

            {/* Sorting filter */}
            <div>
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={{ cursor: 'pointer', backgroundColor: '#141124' }}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Minimum Rating Options (Seen Clearly) */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Minimum Customer Rating</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: '⭐ All Ratings', value: 0 },
                { label: '⭐ 4.5 & Above', value: 4.5 },
                { label: '⭐ 4.6 & Above', value: 4.6 },
                { label: '⭐ 4.7 & Above', value: 4.7 },
                { label: '⭐ 4.8 & Above', value: 4.8 },
                { label: '⭐ 4.9 & Above', value: 4.9 }
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setMinimumRating(r.value)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    border: '1px solid',
                    borderColor: minimumRating === r.value ? 'var(--color-primary)' : 'var(--border-glass)',
                    backgroundColor: minimumRating === r.value ? 'rgba(226, 149, 120, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: minimumRating === r.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  className="nav-link"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div>
          {status === 'loading' || status === 'idle' ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--color-primary)' }}>
              <div className="font-serif" style={{ fontSize: '1.25rem' }}>Loading catalog...</div>
            </div>
          ) : status === 'failed' ? (
            <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Failed to Load Catalog</h3>
              <p>Could not retrieve the product inventory. Please check if the backend service is running.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => dispatch(fetchProducts())}
              >
                Retry Loading
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Product Not Found</h3>
              <p>Try clearing your filters or searching for something else.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setMaxPrice(5000);
                  setMinimumRating(0);
                  setSortBy('default');
                  setSearchParams({});
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
