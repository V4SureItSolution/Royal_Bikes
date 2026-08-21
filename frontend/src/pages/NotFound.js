import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <Bike size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-subtle)', marginBottom: '2rem' }}>
        The page or route you are attempting to access does not exist on RoyalBikes portal.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} /> Return Home
      </Link>
    </div>
  );
};
