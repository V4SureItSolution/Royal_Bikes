import React from 'react';
import { Bike, Shield, Award, Wrench } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: 'var(--glass-border)',
      padding: '3rem 2rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>
            <Bike size={24} color="#ef4444" />
            <span>ROYAL</span>BIKES
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Premium motorcycle dealership, fleet management, and inventory tracking platform. Pure riding satisfaction since 1901.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>Features</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><Shield size={14} style={{ display: 'inline', marginRight: '6px' }} /> Certified Inventory Tracking</li>
            <li><Award size={14} style={{ display: 'inline', marginRight: '6px' }} /> Royal Service Guarantees</li>
            <li><Wrench size={14} style={{ display: 'inline', marginRight: '6px' }} /> Customer Relationship Management</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>Support & Help</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Email: support@royalbikes.com<br />
            Phone: +91 (800) 555-ROYAL<br />
            Hours: Mon - Sat (9:00 AM - 7:00 PM)
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-subtle)',
        fontSize: '0.85rem'
      }}>
        © {new Date().getFullYear()} RoyalBikes Ltd. All rights reserved. Built with React & Flask.
      </div>
    </footer>
  );
};
