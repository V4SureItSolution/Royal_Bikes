import React, { useState } from 'react';
import { Shield, Key, Users, Check, X, Plus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccessControl = () => {
  const navigate = useNavigate();
  const [roles] = useState([
    { id: 1, name: 'Super Admin', description: 'Full access to all system modules, configurations and reports', usersCount: 2, badge: 'Full Access' },
    { id: 2, name: 'Product Manager', description: 'Can manage stock, delivery challans, booking orders, and vendors', usersCount: 3, badge: 'Manager' },
    { id: 3, name: 'Billing Executive', description: 'Can create receipts, voucher entries, and view customer ledger', usersCount: 5, badge: 'Standard' },
    { id: 4, name: 'Auditor', description: 'Read-only access to current stock, MIS and day-book reports', usersCount: 1, badge: 'Read Only' },
  ]);

  const [permissions] = useState([
    { module: 'Direct Stock', view: true, create: true, edit: true, delete: false },
    { module: 'Booking Order', view: true, create: true, edit: true, delete: false },
    { module: 'Receipt & Vouchers', view: true, create: true, edit: true, delete: false },
    { module: 'Delivery Challan', view: true, create: true, edit: true, delete: false },
    { module: 'Reports (MIS, Day Book, Stock)', view: true, create: false, edit: false, delete: false },
    { module: 'Vendor Management', view: true, create: true, edit: true, delete: true },
    { module: 'Application Settings', view: true, create: true, edit: true, delete: false },
  ]);

  return (
    <div style={{ padding: '1.25rem 2rem 3rem', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Access Control
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
            <Home size={15} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
            <span>•</span>
            <span>Settings</span>
            <span>•</span>
            <span style={{ color: '#0f172a', fontWeight: 500 }}>Access Control</span>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {roles.map(role => (
          <div
            key={role.id}
            style={{
              background: '#ffffff',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="#5046e5" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{role.name}</h3>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, background: '#ede9fe', color: '#5046e5', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                {role.badge}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', minHeight: '38px', margin: '0.5rem 0' }}>{role.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <Users size={14} /> {role.usersCount} Assigned Users
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Role Permissions Matrix
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.25rem 0 0' }}>
            Current module access policies for authenticated roles
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1.25rem' }}>Module Name</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>View</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Create</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Edit</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: '#1e293b' }}>{p.module}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {p.view ? <Check size={18} color="#16a34a" style={{ display: 'inline' }} /> : <X size={18} color="#94a3b8" style={{ display: 'inline' }} />}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {p.create ? <Check size={18} color="#16a34a" style={{ display: 'inline' }} /> : <X size={18} color="#94a3b8" style={{ display: 'inline' }} />}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {p.edit ? <Check size={18} color="#16a34a" style={{ display: 'inline' }} /> : <X size={18} color="#94a3b8" style={{ display: 'inline' }} />}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {p.delete ? <Check size={18} color="#16a34a" style={{ display: 'inline' }} /> : <X size={18} color="#94a3b8" style={{ display: 'inline' }} />}
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
