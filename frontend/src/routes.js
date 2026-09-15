import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DirectStock } from './pages/DirectStock';
import { Receipt } from './pages/Receipt';
import { VoucherEntry } from './pages/VoucherEntry';
import { RtnPayment } from './pages/RtnPayment';
import { DeliveryChallan } from './pages/DeliveryChallan';
import { BookingOrder } from './pages/BookingOrder';
import { CurrentStockReport } from './pages/CurrentStockReport';
import { DayBookReport } from './pages/DayBookReport';
import { Analytics } from './pages/Analytics';
import { Vendor } from './pages/Vendor';
import { AccessControl } from './pages/AccessControl';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Generic Royal Bikes Module View Placeholder
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

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/direct-stock" element={<DirectStock />} />
          <Route path="/booking-order" element={<BookingOrder />} />
          <Route path="/booking-order/entry" element={<BookingOrder />} />
          <Route path="/booking-order/view" element={<BookingOrder />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/voucher-entry" element={<VoucherEntry />} />
          <Route path="/rtn-payment" element={<RtnPayment />} />
          <Route path="/delivery-challan" element={<DeliveryChallan />} />
          <Route path="/delivery-challan/entry" element={<DeliveryChallan />} />
          <Route path="/delivery-challan/view" element={<DeliveryChallan />} />
          <Route path="/current-stock-report" element={<CurrentStockReport />} />
          <Route path="/mis-report" element={<DayBookReport />} />
          <Route path="/day-book" element={<DayBookReport />} />
          
          {/* Vendor Management Routes */}
          <Route path="/vendor" element={<Vendor />} />
          <Route path="/vendor/entry" element={<Vendor />} />
          <Route path="/vendor/view" element={<Vendor />} />
          <Route path="/pages/vendor" element={<Vendor />} />
          <Route path="/pages/vendor/entry" element={<Vendor />} />
          <Route path="/pages/vendor/view" element={<Vendor />} />
          <Route path="/application-settings/vendor" element={<Vendor />} />
          <Route path="/application-settings/vendor/entry" element={<Vendor />} />
          <Route path="/application-settings/vendor/view" element={<Vendor />} />

          {/* Access Control & Application Settings */}
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/application-settings/access-control" element={<AccessControl />} />
          <Route path="/application-settings" element={<Vendor />} />

          <Route path="*" element={<Navigate to="/analytics" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
