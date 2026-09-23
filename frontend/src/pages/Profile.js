import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Shield, Mail, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>System account details and role permissions.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.25rem', borderBottom: 'var(--glass-border)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
            <User size={36} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>{user?.username}</h2>
            <span className="badge badge-gold">{user?.role} Access Level</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <Mail size={18} color="var(--accent-red)" />
            <span>Email: <strong style={{ color: 'var(--text-main)' }}>{user?.email}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <Shield size={18} color="var(--accent-gold)" />
            <span>Role Permissions: <strong style={{ color: 'var(--text-main)' }}>{user?.role}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <Calendar size={18} color="var(--accent-cyan)" />
            <span>Account Created: <strong style={{ color: 'var(--text-main)' }}>{formatDate(user?.created_at)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
