import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  Layers, 
  FileText, 
  Receipt, 
  Ticket, 
  CreditCard, 
  Truck, 
  ChevronRight, 
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="karoda-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="brand-logo-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#06b6d4"/>
            <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12L12 17L22 12" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>KarodaBook</span>
        </NavLink>
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }}></div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="sidebar-search-wrap">
        <div className="sidebar-search-box">
          <Search size={14} color="#64748b" />
          <input type="text" placeholder="Quick Search" readOnly />
          <span className="shortcut-tag">Ctrl K</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav-scroll">
        <div className="sidebar-section-title">Dashboards</div>
        <NavLink 
          to="/analytics" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <TrendingUp size={16} />
            <span>Analytics</span>
          </div>
        </NavLink>

        <div className="sidebar-section-title">Stock</div>
        <NavLink 
          to="/direct-stock" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <Layers size={16} />
            <span>Direct-Stock</span>
          </div>
        </NavLink>

        <div className="sidebar-section-title">Sales</div>
        <NavLink 
          to="/booking-order" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <FileText size={16} />
            <span>Booking Order</span>
          </div>
          <ChevronRight size={14} />
        </NavLink>

        <NavLink 
          to="/receipt" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <Receipt size={16} />
            <span>Receipt</span>
          </div>
        </NavLink>

        <NavLink 
          to="/voucher-entry" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <Ticket size={16} />
            <span>Voucher Entry</span>
          </div>
        </NavLink>

        <NavLink 
          to="/rtn-payment" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <CreditCard size={16} />
            <span>RTN Payment</span>
          </div>
        </NavLink>

        <NavLink 
          to="/delivery-challan" 
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-nav-item-left">
            <Truck size={16} />
            <span>Delivery-Challan</span>
          </div>
          <ChevronRight size={14} />
        </NavLink>
      </div>

      {/* User Profile Footer */}
      <div className="sidebar-user-footer">
        <div className="user-avatar-wrap">
          <div className="avatar-circle">
            <User size={18} />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
            {user?.username || 'Product Manager'}
          </div>
        </div>
        <ChevronDown size={14} color="#64748b" />
      </div>
    </aside>
  );
};
