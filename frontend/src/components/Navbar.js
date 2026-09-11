import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle 
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

export const Navbar = () => {
  const navigate = useNavigate();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <header className="karoda-topbar">
      <div className="add-new-dropdown-container" ref={menuRef}>
        <button 
          className="btn-add-new" 
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus size={16} /> Add New
        </button>

        {/* Dropdown Menu matching screenshot */}
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

      <div className="topbar-right-actions">
        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        <button className="topbar-icon-btn" title="Bookmarks">
          <Bookmark size={20} />
        </button>
      </div>

      {/* New Customer Modal (Exact UI Match) */}
      {showCustomerModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="new-customer-modal-card">
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
