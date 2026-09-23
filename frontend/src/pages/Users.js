import React from 'react';
import { ShieldCheck, UserCheck, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { fetchWithAuth } from '../services/api';
import { Loader } from '../components/Loader';
import { formatDate } from '../utils/formatters';

export const Users = () => {
  const { data: users, loading, refetch } = useFetch(API_ENDPOINTS.USERS.BASE);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await fetchWithAuth(API_ENDPOINTS.USERS.BY_ID(userId), {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to revoke and delete this system account?')) {
      try {
        await fetchWithAuth(API_ENDPOINTS.USERS.BY_ID(userId), {
          method: 'DELETE'
        });
        refetch();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <Loader message="Loading administrative accounts..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>User Administration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage staff accounts, credentials, and access roles.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Access Role</th>
                <th>Account Status</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.username}</strong></td>
                  <td style={{ color: 'var(--text-subtle)' }}>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="form-input"
                      style={{ padding: '0.25rem 0.5rem', width: '130px', fontSize: '0.85rem' }}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'badge-green' : 'badge-red'}`}>
                      {user.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>{formatDate(user.created_at)}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="btn btn-danger" 
                      style={{ padding: '0.35rem 0.5rem' }}
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
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
