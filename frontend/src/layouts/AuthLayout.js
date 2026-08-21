import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bike } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1f2937 0%, #0b0f19 100%)',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bike size={36} color="#ef4444" />
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              <span style={{ color: '#ef4444' }}>ROYAL</span>BIKES
            </span>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Dealer & Inventory Portal Management System
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
