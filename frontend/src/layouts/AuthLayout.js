import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { RoyalBikesLogo } from '../components/RoyalBikesLogo';

export const AuthLayout = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      <div className="auth-container">
        {/* Brand Header with Royal Bikes Logo */}
        <div className="auth-header" style={{ marginBottom: '1.25rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <RoyalBikesLogo width={180} />
          </Link>
          <p className="auth-subtitle" style={{ marginTop: '0.65rem' }}>
            Royal Bikes Showroom & Dealer Management System
          </p>
        </div>

        {/* Card Component */}
        <div className="auth-card">
          <Outlet />
        </div>

        {/* System Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Secure Enterprise Cloud Session • Version 2.3.3</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

