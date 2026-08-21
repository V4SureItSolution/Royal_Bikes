import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DirectStock } from './pages/DirectStock';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Generic KarodaBook Module View Placeholder
const ModuleView = ({ title }) => (
  <div style={{ padding: '1rem' }}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{title}</h2>
    <div className="table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
      {title} records and entry forms.
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* App Main Layout Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/direct-stock" replace />} />
        <Route path="/direct-stock" element={<DirectStock />} />
        <Route path="/analytics" element={<ModuleView title="Analytics Dashboard" />} />
        <Route path="/booking-order" element={<ModuleView title="Booking Order" />} />
        <Route path="/receipt" element={<ModuleView title="Receipt" />} />
        <Route path="/voucher-entry" element={<ModuleView title="Voucher Entry" />} />
        <Route path="/rtn-payment" element={<ModuleView title="RTN Payment" />} />
        <Route path="/delivery-challan" element={<ModuleView title="Delivery Challan" />} />
        <Route path="*" element={<Navigate to="/direct-stock" replace />} />
      </Route>
    </Routes>
  );
};
