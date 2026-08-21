import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { productService } from '../services/productService';
import { useFetch } from '../hooks/useFetch';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { ProductCard } from '../components/ProductCard';
import { Modal } from '../components/Modal';
import { Loader } from '../components/Loader';
import { BIKE_CATEGORIES } from '../constants/appConstants';
import { useAuth } from '../hooks/useAuth';

export const Products = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Royal Enfield',
    category: 'Cruiser',
    price: '',
    stock: '',
    description: '',
    image_url: ''
  });

  const queryParams = {};
  if (category) queryParams.category = category;
  if (search) queryParams.search = search;

  const { data: products, loading, refetch } = useFetch(
    `${API_ENDPOINTS.PRODUCTS.BASE}?${new URLSearchParams(queryParams).toString()}`
  );

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await productService.createProduct(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          brand: 'Royal Enfield',
          category: 'Cruiser',
          price: '',
          stock: '',
          description: '',
          image_url: ''
        });
        refetch();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bike entry?')) {
      try {
        await productService.deleteProduct(id);
        refetch();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Motorcycle Inventory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse and manage available showroom models and accessories.</p>
        </div>

        {user && (user.role === 'admin' || user.role === 'manager') && (
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Add New Motorcycle
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-input"
          style={{ width: '200px' }}
        >
          <option value="">All Categories</option>
          {BIKE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <Loader message="Loading motorcycle catalog..." />
      ) : products?.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No motorcycles found matching your filter criteria.
        </div>
      ) : (
        <div className="grid-3">
          {products?.map((bike) => (
            <ProductCard
              key={bike.id}
              product={bike}
              onViewDetails={(p) => setSelectedProduct(p)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Motorcycle">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label>Model Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Continental GT 650"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              >
                {BIKE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Ex-Showroom Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Stock Count</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Bike</button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      {selectedProduct && (
        <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct.name}>
          <div>
            <img
              src={selectedProduct.image_url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
              alt={selectedProduct.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedProduct.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: 'var(--glass-border)' }}>
              <div>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>Brand:</span>
                <div><strong>{selectedProduct.brand}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>Stock:</span>
                <div><strong>{selectedProduct.stock} units</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>Price:</span>
                <div style={{ color: '#ef4444', fontWeight: 800 }}>₹{selectedProduct.price}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
