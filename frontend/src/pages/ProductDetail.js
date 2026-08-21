import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Loader } from '../components/Loader';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, Bike, ShieldCheck, CheckCircle } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch(API_ENDPOINTS.PRODUCTS.BY_ID(id));

  if (loading) return <Loader message="Loading motorcycle specification..." />;
  if (error || !product) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Product Not Found</h3>
        <button onClick={() => navigate('/products')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>

        <div>
          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>{product.category}</span>
          <h1 style={{ fontSize: '2rem', margin: '0.2rem 0' }}>{product.name}</h1>
          <p style={{ color: 'var(--text-subtle)', marginBottom: '1rem' }}>By {product.brand}</p>
          
          <div style={{ fontSize: '2rem', color: '#ef4444', fontWeight: 800, marginBottom: '1.5rem' }}>
            {formatCurrency(product.price)}
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {product.description || 'No detailed specifications recorded.'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <CheckCircle size={18} color="#22c55e" />
              <span>Available Stock: <strong>{product.stock} units</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <ShieldCheck size={18} color="#06b6d4" />
              <span>3-Year Standard Royal Enfield Warranty Included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
