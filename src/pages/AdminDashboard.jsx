import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct, selectAllProducts, selectProductsStatus } from '../redux/productSlice';
import { Plus, Edit2, Trash2, X, Check, Save } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Home Decor');
  const [brand, setBrand] = useState('GiftCorner Originals');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(50);
  const [rating, setRating] = useState(5.0);
  


  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setImage('');
    setCategory('Home Decor');
    setBrand('GiftCorner Originals');
    setDescription('');
    setStock(50);
    setRating(5.0);

    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.price.toString());
    setImage(product.image);
    setCategory(product.category);
    setBrand(product.brand || 'GiftCorner Originals');
    setDescription(product.description);
    setStock(product.stock);
    setRating(product.rating);
    

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        triggerToast('Product deleted successfully!');
      } catch {
        alert('Failed to delete product.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !image || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Price must be a valid positive number.');
      return;
    }

    const parsedRating = parseFloat(rating);
    const parsedStock = parseInt(stock);

    const productData = {
      title,
      price: parsedPrice,
      image,
      category,
      brand: brand.trim(),
      rating: isNaN(parsedRating) ? 5.0 : parsedRating,
      description,
      stock: isNaN(parsedStock) ? 50 : parsedStock,

    };

    try {
      if (editingProduct) {
        // Update (PUT)
        await dispatch(updateProduct({ id: editingProduct.id, productData })).unwrap();
        triggerToast('Product updated successfully!');
      } else {
        // Create (POST)
        await dispatch(addProduct(productData)).unwrap();
        triggerToast('Product added successfully!');
      }
      closeModal();
    } catch {
      alert('Error saving product data.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>Admin Dashboard</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Manage gift catalog, edit pricing, and organize inventory items.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} />
          Add New Gift
        </button>
      </div>

      {status === 'loading' ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-primary)' }}>Loading inventory catalog...</div>
      ) : (
        <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--color-primary)' }}>
                <th style={{ padding: '1rem' }}>Image</th>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Stock</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem' }}>
                    <img src={product.image} alt={product.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{product.category}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-secondary)' }}>{formatPrice(product.price)}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{product.stock} pcs</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(product)} style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--color-primary)', backgroundColor: 'rgba(226, 149, 120, 0.05)', cursor: 'pointer' }} className="nav-link">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--color-danger)', backgroundColor: 'rgba(230, 57, 70, 0.05)', cursor: 'pointer' }} className="nav-link">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--color-overlay)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative', background: '#100c22' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--color-text-muted)', cursor: 'pointer' }} className="nav-link">
              <X size={20} />
            </button>
            
            <h2 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              {editingProduct ? 'Edit Gift Template' : 'Add New Gift Template'}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Product Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Personalized Mug"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ backgroundColor: '#141124', cursor: 'pointer' }}
                  >
                    <option value="Home Decor">Home Decor</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Kitchenware">Kitchenware</option>
                    <option value="Romantic">Romantic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input type="text" className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="1499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="form-input"
                    placeholder="4.8"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Enter details about this personalized gift..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                ></textarea>
              </div>



              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary" style={{ borderRadius: '8px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px', gap: '0.25rem' }}>
                  <Save size={16} />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Toast alert */}
      {showToast && (
        <div className="toast-msg" style={{ borderLeftColor: 'var(--color-success)' }}>
          <div style={{ backgroundColor: 'var(--color-success)', display: 'flex', padding: '0.25rem', borderRadius: '50%', color: '#07050f' }}>
            <Check size={16} strokeWidth={3} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Success</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{toastMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
