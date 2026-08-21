import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ProductCard = ({ product, onViewDetails, onDelete }) => {
  const { user } = useAuth();
  const defaultImage = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-panel bike-card">
      <div className="bike-img-wrap">
        <img 
          src={product.image_url || defaultImage} 
          alt={product.name}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
            {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className="badge badge-gold">{product.category}</span>
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
          {product.brand}
        </div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0.2rem 0 0.5rem' }}>
          {product.name}
        </h3>
        
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.5rem',
          marginBottom: '1rem'
        }}>
          {product.description || 'No description provided.'}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify-content: 'space-between',
          borderTop: 'var(--glass-border)',
          paddingTop: '0.85rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>Ex-Showroom Price</span>
            <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>{formatCurrency(product.price)}</strong>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              onClick={() => onViewDetails(product)} 
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.65rem' }}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            {user && (user.role === 'admin' || user.role === 'manager') && onDelete && (
              <button 
                onClick={() => onDelete(product.id)} 
                className="btn btn-danger"
                style={{ padding: '0.45rem 0.65rem' }}
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
