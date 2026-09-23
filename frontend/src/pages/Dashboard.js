import React from 'react';
import { Bike, Users, DollarSign, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Loader } from '../components/Loader';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const { data: products, loading: loadingProducts } = useFetch(API_ENDPOINTS.PRODUCTS.BASE);
  const { data: customers, loading: loadingCustomers } = useFetch(API_ENDPOINTS.CUSTOMERS.BASE);

  if (loadingProducts || loadingCustomers) {
    return <Loader message="Loading dashboard statistics..." />;
  }

  const totalBikes = products?.length || 0;
  const totalStock = products?.reduce((acc, curr) => acc + (curr.stock || 0), 0) || 0;
  const totalValue = products?.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.stock || 0)), 0) || 0;
  const totalCustomers = customers?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Showroom Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time inventory metrics and sales lead activity.</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <Bike size={28} color="#ef4444" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Total Models</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalBikes}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} color="#f59e0b" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Units in Stock</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalStock}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <DollarSign size={28} color="#22c55e" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Total Inventory Value</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatCurrency(totalValue)}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <Users size={28} color="#06b6d4" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Registered Clients</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalCustomers}</h2>
          </div>
        </div>
      </div>

      {/* Featured Bikes Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Inventory Status</h3>
          <Link to="/products" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            View All Bikes <ArrowRight size={16} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Category</th>
                <th>Ex-Showroom Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products?.slice(0, 5).map((bike) => (
                <tr key={bike.id}>
                  <td><strong>{bike.name}</strong></td>
                  <td><span className="badge badge-gold">{bike.category}</span></td>
                  <td style={{ color: '#ef4444', fontWeight: 700 }}>{formatCurrency(bike.price)}</td>
                  <td>{bike.stock} units</td>
                  <td>
                    <span className={`badge ${bike.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                      {bike.stock > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
