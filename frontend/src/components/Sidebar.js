import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  LogOut,
  Shield,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { RoyalBikesMark } from './RoyalBikesLogo';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Submenu collapsible states
  const [isBookingOpen, setIsBookingOpen] = useState(true);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [isMisOpen, setIsMisOpen] = useState(true);

  // Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const navItems = [
    { id: 'analytics', title: 'Analytics', path: '/analytics', icon: TrendingUp, category: 'Dashboards' },
    { id: 'direct-stock', title: 'Direct-Stock', path: '/direct-stock', icon: Layers, category: 'Stock' },
    { id: 'booking-entry', title: 'Booking Order Entry', path: '/booking-order/entry', icon: FileText, category: 'Sales' },
    { id: 'booking-view', title: 'Booking Order View', path: '/booking-order/view', icon: FileText, category: 'Sales' },
    { id: 'receipt', title: 'Receipt', path: '/receipt', icon: Receipt, category: 'Sales' },
    { id: 'voucher-entry', title: 'Voucher Entry', path: '/voucher-entry', icon: Ticket, category: 'Sales' },
    { id: 'rtn-payment', title: 'RTN Payment', path: '/rtn-payment', icon: CreditCard, category: 'Sales' },
    { id: 'delivery-entry', title: 'Delivery-Challan Entry', path: '/delivery-challan/entry', icon: Truck, category: 'Sales' },
    { id: 'delivery-view', title: 'Delivery-Challan View', path: '/delivery-challan/view', icon: Truck, category: 'Sales' },
    { id: 'current-stock-report', title: 'Current Stock Report', path: '/current-stock-report', icon: Tag, category: 'Reports' },
    { id: 'day-book', title: 'Day Book (MIS)', path: '/day-book', icon: FileSpreadsheet, category: 'Reports' },
    { id: 'app-settings', title: 'Application Settings', path: '/application-settings', icon: Settings, category: 'Settings' },
  ];

  const filteredItems = navItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectResult = (path) => {
    navigate(path);
    setSearchQuery('');
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
        <NavLink to="/" className="brand-logo-wrap" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <RoyalBikesMark width={34} color="#ffffff" />
          <span style={{ 
            fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif", 
            fontWeight: 800, 
            letterSpacing: '1.2px',
            fontSize: '1.2rem',
            color: '#ffffff',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            ROYAL BIKES
          </span>
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsBookingOpen(prev => !prev);
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeliveryOpen(prev => !prev);
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsMisOpen(prev => !prev);
                }}
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

      {/* User Profile / Admin Footer */}
      <div style={{ position: 'relative' }} ref={userMenuRef}>
        {showUserMenu && (
          <div className="sidebar-user-menu-popup">
            <div className="sidebar-user-popup-header">
              <div className="avatar-circle" style={{ width: '36px', height: '36px' }}>
                <User size={18} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {user?.username || 'admin'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {user?.role || 'Administrator'}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '0.5rem 0' }} />

            <button 
              type="button" 
              className="sidebar-user-menu-item logout-item"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <div 
          className="sidebar-user-footer"
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{ cursor: 'pointer' }}
          title="Admin Profile / Options"
        >
          <div className="user-avatar-wrap">
            <div className="avatar-circle">
              <User size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                {user?.username || 'admin'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                {user?.role || 'Administrator'}
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="sidebar-direct-logout"
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
