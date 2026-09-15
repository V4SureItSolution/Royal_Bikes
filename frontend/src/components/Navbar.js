import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Bell, 
  Bookmark, 
  UserPlus, 
  CheckCheck, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Crosshair, 
  Building2, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  BookmarkCheck,
  Check,
  ExternalLink
} from 'lucide-react';
import { customerService } from '../services/customerService';

const INDIAN_STATES = [
  'TAMIL NADU',
  'ANDHRA PRADESH',
  'KARNATAKA',
  'KERALA',
  'MAHARASHTRA',
  'TELANGANA',
  'DELHI',
  'PUDUCHERRY',
  'GUJARAT',
  'RAJASTHAN',
  'WEST BENGAL'
];

const DEFAULT_BOOKMARKS = [
  { id: '1', title: 'Direct Stock Entry', path: '/direct-stock' },
  { id: '2', title: 'Delivery Challan Entry', path: '/delivery-challan/entry' },
  { id: '3', title: 'Booking Order Entry', path: '/booking-order/entry' },
  { id: '4', title: 'Current Stock Report', path: '/current-stock-report' },
  { id: '5', title: 'MIS Day Book Report', path: '/day-book' }
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Honda Activa 6G STD is low on showroom stock (1 unit remaining).',
      time: '12m ago',
      read: false,
      path: '/current-stock-report'
    },
    {
      id: 2,
      type: 'info',
      title: 'Scheduled Delivery',
      message: 'Delivery Challan DC-2026-001 is scheduled for delivery today.',
      time: '35m ago',
      read: false,
      path: '/delivery-challan/view'
    },
    {
      id: 3,
      type: 'success',
      title: 'Direct Stock Received',
      message: 'Royal Enfield Hunter 350 batch received and verified.',
      time: '1h ago',
      read: false,
      path: '/direct-stock'
    },
    {
      id: 4,
      type: 'neutral',
      title: 'Day Book Reconciled',
      message: 'All daily receipts and voucher balances are synchronized.',
      time: '3h ago',
      read: true,
      path: '/day-book'
    }
  ]);

  // Bookmarks State
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem('royalbikes_bookmarks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_BOOKMARKS;
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    flatHouseNo: '',
    streetArea: '',
    landmark: '',
    pincode: '',
    townCity: '',
    state: 'TAMIL NADU'
  });

  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const bookmarkRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (bookmarkRef.current && !bookmarkRef.current.contains(event.target)) {
        setShowBookmarks(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleToggleBookmarkCurrentPage = () => {
    const currentPath = location.pathname;
    const pathTitles = {
      '/': 'Analytics Dashboard',
      '/analytics': 'Analytics Dashboard',
      '/direct-stock': 'Direct Stock Entry',
      '/booking-order': 'Booking Order',
      '/booking-order/entry': 'Booking Order Entry',
      '/booking-order/view': 'Booking Order View',
      '/receipt': 'Receipt Entry',
      '/voucher-entry': 'Voucher Entry',
      '/rtn-payment': 'RTN Payment',
      '/delivery-challan': 'Delivery Challan',
      '/delivery-challan/entry': 'Delivery Challan Entry',
      '/delivery-challan/view': 'Delivery Challan View',
      '/current-stock-report': 'Current Stock Report',
      '/mis-report': 'MIS Report',
      '/day-book': 'MIS Day Book Report'
    };

    const title = pathTitles[currentPath] || 'Showroom Page';
    const isAlreadyBookmarked = bookmarks.some((b) => b.path === currentPath);

    let updatedBookmarks;
    if (isAlreadyBookmarked) {
      updatedBookmarks = bookmarks.filter((b) => b.path !== currentPath);
    } else {
      updatedBookmarks = [{ id: Date.now().toString(), title, path: currentPath }, ...bookmarks];
    }

    setBookmarks(updatedBookmarks);
    localStorage.setItem('royalbikes_bookmarks', JSON.stringify(updatedBookmarks));
  };

  const handleDeleteBookmark = (e, id) => {
    e.stopPropagation();
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('royalbikes_bookmarks', JSON.stringify(updated));
  };

  const handleOpenAddCustomer = () => {
    setShowAddMenu(false);
    setAlert(null);
    setForm({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      flatHouseNo: '',
      streetArea: '',
      landmark: '',
      pincode: '',
      townCity: '',
      state: 'TAMIL NADU'
    });
    setShowCustomerModal(true);
  };

  const handleOpenAddDirectStock = () => {
    setShowAddMenu(false);
    navigate('/direct-stock');
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) {
      setAlert({ type: 'error', message: 'First Name is required.' });
      return;
    }
    if (!form.phoneNumber.trim()) {
      setAlert({ type: 'error', message: 'Phone Number is required.' });
      return;
    }

    try {
      setLoading(true);
      setAlert(null);
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        phone_number: form.phoneNumber,
        email: form.email,
        flat_house_no: form.flatHouseNo,
        street_area: form.streetArea,
        landmark: form.landmark,
        pincode: form.pincode,
        town_city: form.townCity,
        state: form.state
      };

      const res = await customerService.createCustomer(payload);
      if (res && res.success) {
        setAlert({ type: 'success', message: 'Customer created successfully!' });
        setTimeout(() => {
          setShowCustomerModal(false);
          setAlert(null);
        }, 1000);
      } else {
        setAlert({ type: 'error', message: res?.message || 'Failed to save customer' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err?.message || 'Error communicating with server' });
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPageBookmarked = bookmarks.some((b) => b.path === location.pathname);

  return (
    <header className="karoda-topbar">
      {/* Add New Dropdown */}
      <div className="add-new-dropdown-container" ref={menuRef}>
        <button 
          className="btn-add-new" 
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus size={16} /> Add New
        </button>

        {showAddMenu && (
          <div className="add-new-menu-popup">
            <button 
              className="add-new-menu-item active-hover"
              onClick={handleOpenAddCustomer}
            >
              <UserPlus size={16} className="menu-icon-customer" />
              <span>Add Customer</span>
            </button>
            <button 
              className="add-new-menu-item"
              onClick={handleOpenAddDirectStock}
            >
              <CheckCheck size={16} className="menu-icon-stock" />
              <span>Add Direct-Stock</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Actions: Notifications & Bookmarks */}
      <div className="topbar-right-actions">
        {/* Notifications Button & Dropdown */}
        <div className="topbar-action-item" ref={notifRef}>
          <button 
            className={`topbar-icon-btn ${showNotifications ? 'active' : ''}`} 
            title="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowBookmarks(false);
            }}
          >
            <Bell size={20} />
            {unreadNotifCount > 0 && (
              <span className="topbar-badge-pill">{unreadNotifCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="topbar-popup-panel">
              <div className="topbar-popup-header">
                <div className="topbar-popup-title">
                  <Bell size={16} color="#6366f1" />
                  <span>Notifications</span>
                  {unreadNotifCount > 0 && (
                    <span style={{ fontSize: '0.72rem', background: '#e0e7ff', color: '#4338ca', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: 700 }}>
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button 
                    className="topbar-popup-action-btn"
                    onClick={handleMarkAllNotificationsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="topbar-popup-list">
                {notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`topbar-notification-item ${!item.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(item)}
                  >
                    <div className={`notification-icon-wrap ${item.type}`}>
                      {item.type === 'warning' && <AlertTriangle size={16} />}
                      {item.type === 'info' && <Info size={16} />}
                      {item.type === 'success' && <CheckCircle size={16} />}
                      {item.type === 'neutral' && <Clock size={16} />}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{item.title}</div>
                      <div className="notification-message">{item.message}</div>
                      <div className="notification-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bookmarks Button & Dropdown */}
        <div className="topbar-action-item" ref={bookmarkRef}>
          <button 
            className={`topbar-icon-btn ${showBookmarks ? 'active' : ''}`} 
            title="Saved Bookmarks & Quick Links"
            onClick={() => {
              setShowBookmarks(!showBookmarks);
              setShowNotifications(false);
            }}
          >
            <Bookmark size={20} color={isCurrentPageBookmarked ? '#4f46e5' : undefined} fill={isCurrentPageBookmarked ? '#6366f1' : 'none'} />
          </button>

          {showBookmarks && (
            <div className="topbar-popup-panel">
              <div className="topbar-popup-header">
                <div className="topbar-popup-title">
                  <Bookmark size={16} color="#6366f1" />
                  <span>Bookmarks & Quick Links</span>
                </div>
              </div>

              <div className="topbar-popup-list">
                {bookmarks.map((bm) => (
                  <div 
                    key={bm.id} 
                    className="topbar-bookmark-item"
                    onClick={() => {
                      setShowBookmarks(false);
                      navigate(bm.path);
                    }}
                  >
                    <div className="topbar-bookmark-left">
                      <Bookmark size={15} color="#6366f1" fill="#e0e7ff" />
                      <span>{bm.title}</span>
                    </div>
                    <button 
                      type="button" 
                      className="topbar-bookmark-del-btn"
                      onClick={(e) => handleDeleteBookmark(e, bm.id)}
                      title="Remove Bookmark"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="topbar-bookmark-add-row">
                <button 
                  type="button" 
                  className="topbar-bookmark-add-btn"
                  onClick={handleToggleBookmarkCurrentPage}
                >
                  {isCurrentPageBookmarked ? (
                    <>
                      <Check size={14} />
                      <span>Bookmarked (Click to Unpin)</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Bookmark This Page</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* New Customer Modal (Exact UI Match) */}
      {showCustomerModal && (
        <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="new-customer-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="new-customer-modal-header">
              <h2 className="new-customer-modal-title">New Customer</h2>
              <button 
                type="button"
                className="new-customer-close-btn" 
                onClick={() => setShowCustomerModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {alert && (
              <div className={`alert-banner ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ margin: '0.75rem 0' }}>
                {alert.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                <span>{alert.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCustomerSubmit} className="new-customer-form">
              {/* Row 1: First Name & Last Name */}
              <div className="new-customer-row-2">
                <fieldset className="nc-fieldset active-focus">
                  <legend className="nc-legend">First Name*</legend>
                  <div className="nc-input-inner">
                    <User size={16} className="nc-icon" />
                    <input 
                      type="text" 
                      required 
                      className="nc-input" 
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      autoFocus
                    />
                  </div>
                </fieldset>

                <fieldset className="nc-fieldset">
                  <legend className="nc-legend">Last Name</legend>
                  <div className="nc-input-inner">
                    <User size={16} className="nc-icon" />
                    <input 
                      type="text" 
                      className="nc-input" 
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </fieldset>
              </div>

              {/* Row 2: Phone Number */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Phone Number*</legend>
                <div className="nc-input-inner">
                  <Phone size={15} className="nc-icon" />
                  <input 
                    type="tel" 
                    required 
                    className="nc-input" 
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 3: Email */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Email</legend>
                <div className="nc-input-inner">
                  <Mail size={15} className="nc-icon" />
                  <input 
                    type="email" 
                    className="nc-input" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 4: Flat,HouseNo */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Flat,HouseNo</legend>
                <div className="nc-input-inner">
                  <input 
                    type="text" 
                    className="nc-input nc-input-noicon" 
                    value={form.flatHouseNo}
                    onChange={(e) => setForm({ ...form, flatHouseNo: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 5: Street,Area,Sector,Village */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Street,Area,Sector,Village</legend>
                <div className="nc-input-inner">
                  <MapPin size={15} className="nc-icon" />
                  <input 
                    type="text" 
                    className="nc-input" 
                    value={form.streetArea}
                    onChange={(e) => setForm({ ...form, streetArea: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 6: Landmark */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Landmark</legend>
                <div className="nc-input-inner">
                  <input 
                    type="text" 
                    className="nc-input nc-input-noicon" 
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 7: Pincode* */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Pincode*</legend>
                <div className="nc-input-inner">
                  <Crosshair size={15} className="nc-icon" />
                  <input 
                    type="text" 
                    required 
                    className="nc-input" 
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 8: Town,City */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Town,City</legend>
                <div className="nc-input-inner">
                  <Building2 size={15} className="nc-icon" />
                  <input 
                    type="text" 
                    className="nc-input" 
                    value={form.townCity}
                    onChange={(e) => setForm({ ...form, townCity: e.target.value })}
                  />
                </div>
              </fieldset>

              {/* Row 9: State Dropdown */}
              <fieldset className="nc-fieldset">
                <legend className="nc-legend">Select State / Province / Region*</legend>
                <div className="nc-input-inner nc-select-wrapper">
                  <select 
                    className="nc-select"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="nc-select-arrow" />
                </div>
              </fieldset>

              {/* Modal Footer Actions */}
              <div className="new-customer-footer-actions">
                <button 
                  type="button" 
                  className="nc-btn-cancel" 
                  onClick={() => setShowCustomerModal(false)}
                  disabled={loading}
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="nc-btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
