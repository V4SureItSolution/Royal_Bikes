import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  User,
  Tag,
  FileSpreadsheet,
  BookOpen,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { id: 'analytics', title: 'Analytics', path: '/analytics', category: 'Dashboards', icon: TrendingUp },
  { id: 'direct-stock', title: 'Direct-Stock', path: '/direct-stock', category: 'Stock', icon: Layers },
  { id: 'booking-order', title: 'Booking Order', path: '/booking-order', category: 'Sales', icon: FileText },
  { id: 'booking-order-entry', title: 'Booking Order Entry', path: '/booking-order/entry', category: 'Sales', icon: FileText },
  { id: 'booking-order-view', title: 'Booking Order View', path: '/booking-order/view', category: 'Sales', icon: FileText },
  { id: 'receipt', title: 'Receipt', path: '/receipt', category: 'Sales', icon: Receipt },
  { id: 'voucher-entry', title: 'Voucher Entry', path: '/voucher-entry', category: 'Sales', icon: Ticket },
  { id: 'rtn-payment', title: 'RTN Payment', path: '/rtn-payment', category: 'Sales', icon: CreditCard },
  { id: 'delivery-challan', title: 'Delivery-Challan', path: '/delivery-challan', category: 'Sales', icon: Truck },
  { id: 'delivery-challan-entry', title: 'Delivery-Challan Entry', path: '/delivery-challan/entry', category: 'Sales', icon: Truck },
  { id: 'delivery-challan-view', title: 'Delivery-Challan View', path: '/delivery-challan/view', category: 'Sales', icon: Truck },
  { id: 'current-stock-report', title: 'Current Stock Report', path: '/current-stock-report', category: 'Reports', icon: Tag },
  { id: 'mis-report', title: 'MIS REPORT', path: '/mis-report', category: 'Reports', icon: FileSpreadsheet },
  { id: 'day-book', title: 'Day Book', path: '/day-book', category: 'Reports', icon: BookOpen },
  { id: 'application-settings', title: 'Application Settings', path: '/application-settings', category: 'SETTINGS', icon: Settings },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(
    location.pathname.startsWith('/booking-order')
  );
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(
    location.pathname.startsWith('/delivery-challan')
  );
  const [isMisOpen, setIsMisOpen] = useState(
    location.pathname === '/day-book'
  );

  // Global Ctrl + K / Cmd + K keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems = searchQuery.trim() === '' ? [] : NAV_ITEMS.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectResult = (path) => {
    navigate(path);
    setSearchQuery('');
    if (path.startsWith('/booking-order')) setIsBookingOpen(true);
    if (path.startsWith('/delivery-challan')) setIsDeliveryOpen(true);
    if (path === '/day-book' || path === '/mis-report') setIsMisOpen(true);
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter' && filteredItems.length > 0) {
      handleSelectResult(filteredItems[0].path);
    }
  };

  return (
    <aside className="karoda-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="brand-logo-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#06b6d4" />
            <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12L12 17L22 12" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
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
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Quick Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDownInput}
          />
          {searchQuery ? (
            <X
              size={14}
              color="#94a3b8"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
            />
          ) : (
            <span className="shortcut-tag" style={{ cursor: 'pointer' }} onClick={() => searchInputRef.current?.focus()}>Ctrl K</span>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav-scroll">
        {searchQuery.trim() !== '' ? (
          filteredItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
              <div className="sidebar-section-title">Search Results ({filteredItems.length})</div>
              {filteredItems.map(item => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.id}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectResult(item.path)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="sidebar-nav-item-left">
                      <IconComponent size={16} />
                      <span>{item.title}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No results found for "{searchQuery}"
            </div>
          )
        ) : (
          <>
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

            {/* Booking Order Submenu Accordion */}
            <div className="sidebar-accordion">
              <NavLink
                to="/booking-order"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsBookingOpen(prev => !prev)}
              >
                <div className="sidebar-nav-item-left">
                  <FileText size={16} />
                  <span>Booking Order</span>
                </div>
                {isBookingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </NavLink>
              {isBookingOpen && (
                <div style={{ paddingLeft: '2.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                  <NavLink
                    to="/booking-order/entry"
                    className={({ isActive }) => `sidebar-subnav-item ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.84rem', color: '#94a3b8', padding: '0.35rem 0.75rem', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    Entry
                  </NavLink>
                  <NavLink
                    to="/booking-order/view"
                    className={({ isActive }) => `sidebar-subnav-item ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.84rem', color: '#94a3b8', padding: '0.35rem 0.75rem', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    View
                  </NavLink>
                </div>
              )}
            </div>

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

            {/* Delivery-Challan Submenu Accordion */}
            <div className="sidebar-accordion">
              <NavLink
                to="/delivery-challan"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsDeliveryOpen(prev => !prev)}
              >
                <div className="sidebar-nav-item-left">
                  <Truck size={16} />
                  <span>Delivery-Challan</span>
                </div>
                {isDeliveryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </NavLink>
              {isDeliveryOpen && (
                <div style={{ paddingLeft: '2.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                  <NavLink
                    to="/delivery-challan/entry"
                    className={({ isActive }) => `sidebar-subnav-item ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.84rem', color: '#94a3b8', padding: '0.35rem 0.75rem', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    Entry
                  </NavLink>
                  <NavLink
                    to="/delivery-challan/view"
                    className={({ isActive }) => `sidebar-subnav-item ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.84rem', color: '#94a3b8', padding: '0.35rem 0.75rem', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    View
                  </NavLink>
                </div>
              )}
            </div>

            {/* REPORTS Section */}
            <div className="sidebar-section-title">Reports</div>

            <NavLink
              to="/current-stock-report"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-nav-item-left">
                <Tag size={16} />
                <span>Current Stock Report</span>
              </div>
            </NavLink>

            <div className="sidebar-accordion">
              <NavLink
                to="/mis-report"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMisOpen(prev => !prev)}
              >
                <div className="sidebar-nav-item-left">
                  <FileSpreadsheet size={16} />
                  <span>MIS REPORT</span>
                </div>
                {isMisOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </NavLink>
              {isMisOpen && (
                <div style={{ paddingLeft: '2.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                  <NavLink
                    to="/day-book"
                    className={({ isActive }) => `sidebar-subnav-item ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.84rem', color: '#94a3b8', padding: '0.35rem 0.75rem', borderRadius: '4px', textDecoration: 'none' }}
                  >
                    Day Book
                  </NavLink>
                </div>
              )}
            </div>

            {/* SETTINGS Section */}
            <div className="sidebar-section-title">SETTINGS</div>

            <NavLink
              to="/application-settings"
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-nav-item-left">
                <Settings size={16} />
                <span>Application Settings</span>
              </div>
              <ChevronRight size={14} />
            </NavLink>
          </>
        )}
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
