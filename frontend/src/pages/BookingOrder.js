import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Home, 
  Calendar, 
  Search, 
  Printer, 
  X, 
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Building2,
  Crosshair,
  Navigation,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { bookingOrderService } from '../services/bookingOrderService';
import { customerService } from '../services/customerService';
import { getTodayDateStr, getFutureDateStr, getCurrentYear } from '../utils/dateUtils';
import { StockNumberSelect } from '../components/StockNumberSelect';

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

const BIKE_MODELS = [
  'Royal Enfield Classic 350',
  'Royal Enfield Hunter 350',
  'Royal Enfield Meteor 350',
  'Royal Enfield Bullet 350',
  'Royal Enfield Himalayan 450',
  'Royal Enfield Guerrilla 450',
  'Royal Enfield Shotgun 650',
  'Royal Enfield Continental GT 650',
  'Royal Enfield Interceptor 650',
  'Royal Enfield Super Meteor 650'
];

export const BookingOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State
  const isViewRoute = location.pathname.endsWith('/view');
  const [activeTab, setActiveTab] = useState(isViewRoute ? 'view' : 'entry');

  useEffect(() => {
    setActiveTab(location.pathname.endsWith('/view') ? 'view' : 'entry');
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'view') {
      navigate('/booking-order/view');
    } else {
      navigate('/booking-order/entry');
    }
  };

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Customers list & auto-suggest
  const [customerList, setCustomerList] = useState(() => customerService.getStoredCustomers());
  const [showCustSuggest, setShowCustSuggest] = useState(false);

  const loadCustomers = async () => {
    const list = await customerService.getAllCustomers();
    setCustomerList(list);
  };

  // Booking Orders List
  const [bookingOrders, setBookingOrders] = useState([]);

  // Form State for Entry tab
  const [formData, setFormData] = useState({
    customer_name: '',
    father_or_spouse_name: '',
    contact_number: '',
    alt_contact_number: '',
    flat_house_no: '',
    street_area: '',
    town_city: '',
    pincode: '',
    state: 'TAMIL NADU',
    model_name: 'Royal Enfield Classic 350',
    color: 'Stealth Black',
    variant: 'Dual Channel ABS',
    booking_date: getTodayDateStr(),
    expected_delivery_date: getFutureDateStr(12),
    total_amount: '225000',
    booking_amount: '25000',
    balance_amount: '200000',
    payment_mode: 'CASH',
    sales_executive: 'Product Manager',
    notes: '',
    status: 'Confirmed'
  });

  // Modal State for Printable Voucher
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);

  // Search & Pagination State for View tab
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch Booking Orders on load
  const loadBookingOrders = async () => {
    try {
      setLoading(true);
      const res = await bookingOrderService.getBookingOrders();
      if (res && res.success && res.data && res.data.length > 0) {
        setBookingOrders(res.data);
      }
    } catch (err) {
      console.log('Using local state for booking orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingOrders();
    loadCustomers();

    const handleCustSync = () => loadCustomers();
    window.addEventListener('customerUpdated', handleCustSync);
    window.addEventListener('storage', handleCustSync);

    return () => {
      window.removeEventListener('customerUpdated', handleCustSync);
      window.removeEventListener('storage', handleCustSync);
    };
  }, []);

  const handleSelectCustomer = (cust) => {
    setFormData((prev) => ({
      ...prev,
      customer_name: cust.name,
      contact_number: cust.mob || cust.phone || prev.contact_number,
      town_city: cust.city || prev.town_city,
      street_area: cust.address ? cust.address.split(',')[0] : prev.street_area
    }));
    setShowCustSuggest(false);
  };

  const handleSelectStock = (stock) => {
    if (!stock) return;
    setFormData((prev) => ({
      ...prev,
      model_name: stock.product || stock.model || prev.model_name,
      color: stock.color || prev.color,
      notes: prev.notes ? `${prev.notes} | Stock: Eng ${stock.engine_number || stock.engineNumber}, Chs ${stock.chassis_number || stock.chassisNumber}` : `Stock Allocation: Eng ${stock.engine_number || stock.engineNumber}, Chs ${stock.chassis_number || stock.chassisNumber}`
    }));
  };

  // Handle Amount auto calculations
  const handleAmountChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    const total = parseFloat(field === 'total_amount' ? value : formData.total_amount) || 0;
    const booking = parseFloat(field === 'booking_amount' ? value : formData.booking_amount) || 0;
    updated.balance_amount = Math.max(0, total - booking).toString();
    setFormData(updated);
  };

  // Handle Form Submit
  const handleSubmitEntry = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');

    if (!formData.customer_name.trim()) {
      setErrorMessage('Customer Name is required.');
      return;
    }
    if (!formData.contact_number.trim()) {
      setErrorMessage('Contact Number is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await bookingOrderService.createBookingOrder(formData);
      if (res && res.success) {
        setSuccessMessage('Booking Order registered successfully!');
        setBookingOrders((prev) => [res.data, ...prev]);
        handleClear();
        setTimeout(() => {
          setSuccessMessage('');
          handleTabChange('view');
        }, 1200);
      } else {
        // Fallback local save
        const currentYr = getCurrentYear();
        const fallbackOrder = {
          ...formData,
          id: Date.now(),
          booking_no: `BK-${currentYr}-${String(bookingOrders.length + 1).padStart(3, '0')}`,
          booking_date: formData.booking_date || getTodayDateStr(),
          expected_delivery_date: formData.expected_delivery_date || getFutureDateStr(12),
          total_amount: parseFloat(formData.total_amount) || 0,
          booking_amount: parseFloat(formData.booking_amount) || 0,
          balance_amount: parseFloat(formData.balance_amount) || 0
        };
        setBookingOrders((prev) => [fallbackOrder, ...prev]);
        setSuccessMessage('Booking Order registered successfully!');
        handleClear();
        setTimeout(() => {
          setSuccessMessage('');
          handleTabChange('view');
        }, 1200);
      }
    } catch (err) {
      const currentYr = getCurrentYear();
      const fallbackOrder = {
        ...formData,
        id: Date.now(),
        booking_no: `BK-${currentYr}-${String(bookingOrders.length + 1).padStart(3, '0')}`,
        booking_date: formData.booking_date || getTodayDateStr(),
        expected_delivery_date: formData.expected_delivery_date || getFutureDateStr(12),
        total_amount: parseFloat(formData.total_amount) || 0,
        booking_amount: parseFloat(formData.booking_amount) || 0,
        balance_amount: parseFloat(formData.balance_amount) || 0
      };
      setBookingOrders((prev) => [fallbackOrder, ...prev]);
      setSuccessMessage('Booking Order registered successfully!');
      handleClear();
      setTimeout(() => {
        setSuccessMessage('');
        handleTabChange('view');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      customer_name: '',
      father_or_spouse_name: '',
      contact_number: '',
      alt_contact_number: '',
      flat_house_no: '',
      street_area: '',
      town_city: '',
      pincode: '',
      state: 'TAMIL NADU',
      model_name: 'Royal Enfield Classic 350',
      color: 'Stealth Black',
      variant: 'Dual Channel ABS',
      booking_date: getTodayDateStr(),
      expected_delivery_date: getFutureDateStr(12),
      total_amount: '225000',
      booking_amount: '25000',
      balance_amount: '200000',
      payment_mode: 'CASH',
      sales_executive: 'Product Manager',
      notes: '',
      status: 'Confirmed'
    });
    setErrorMessage('');
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this Booking Order?')) {
      try {
        await bookingOrderService.deleteBookingOrder(id);
      } catch (err) {
        // local delete fallback
      }
      setBookingOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  // Filtered Booking Orders
  const filteredOrders = bookingOrders.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.booking_no && item.booking_no.toLowerCase().includes(q)) ||
      (item.customer_name && item.customer_name.toLowerCase().includes(q)) ||
      (item.contact_number && item.contact_number.toLowerCase().includes(q)) ||
      (item.model_name && item.model_name.toLowerCase().includes(q)) ||
      (item.town_city && item.town_city.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="order-booking-container">
      {/* Top Breadcrumb & Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="page-title-icon">
            <FileText size={22} />
          </div>
          <div>
            <div className="page-title-text" style={{ margin: 0, fontSize: '1.45rem' }}>
              Order Booking
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b', marginTop: '0.15rem' }}>
              <Home size={13} color="#94a3b8" />
              <span>•</span>
              <span>Sales</span>
              <span>•</span>
              <span style={{ fontWeight: 600, color: '#475569' }}>Order Booking</span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Save Button in Entry Tab */}
        {activeTab === 'entry' && (
          <button 
            type="button" 
            onClick={handleSubmitEntry}
            disabled={loading}
            className="btn-save-pill"
            style={{ padding: '0.6rem 2.2rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)' }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>

      {/* Navigation Tabs (Entry / View) */}
      <div className="karoda-tabs-wrap">
        <button
          className={`karoda-tab ${activeTab === 'entry' ? 'active' : ''}`}
          onClick={() => handleTabChange('entry')}
        >
          Entry
        </button>
        <button
          className={`karoda-tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => handleTabChange('view')}
        >
          View
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#ecfdf5',
          color: '#047857',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: ENTRY FORM */}
      {activeTab === 'entry' && (
        <form onSubmit={handleSubmitEntry}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Main Details Grid: Left Customer Details | Right Address Details */}
            <div className="order-booking-main-grid">
              
              {/* LEFT COLUMN: Customer Details */}
              <div>
                <div className="booking-section-header">
                  <div className="booking-section-icon-badge">
                    <User size={18} />
                  </div>
                  <h3 className="booking-section-title">Customer Details</h3>
                </div>

                {/* Field 1: Name* with Auto-Suggest */}
                <div style={{ position: 'relative' }}>
                  <div className="booking-input-wrap">
                    <User size={16} color="#64748b" style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      required
                      placeholder="Name*"
                      value={formData.customer_name}
                      onFocus={() => setShowCustSuggest(true)}
                      onBlur={() => setTimeout(() => setShowCustSuggest(false), 200)}
                      onChange={(e) => {
                        setFormData({ ...formData, customer_name: e.target.value });
                        setShowCustSuggest(true);
                      }}
                    />
                  </div>

                  {showCustSuggest && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 50,
                      marginTop: '2px'
                    }}>
                      {customerList
                        .filter((c) => !formData.customer_name || c.name.toLowerCase().includes(formData.customer_name.toLowerCase()))
                        .map((c) => (
                          <div
                            key={c.id || c.name}
                            onMouseDown={() => handleSelectCustomer(c)}
                            style={{
                              padding: '0.6rem 0.85rem',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{c.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>City: {c.city} • Mob: {c.mob || c.phone}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Field 2: S/O */}
                <div className="booking-input-wrap">
                  <User size={16} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="S/O"
                    value={formData.father_or_spouse_name}
                    onChange={(e) => setFormData({ ...formData, father_or_spouse_name: e.target.value })}
                  />
                </div>

                {/* Field 3: Contact Number* */}
                <div className="booking-input-wrap">
                  <Phone size={16} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="tel"
                    required
                    placeholder="Contact Number*"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  />
                </div>

                {/* Field 4: Contact Number (Alternate) */}
                <div className="booking-input-wrap">
                  <Phone size={16} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.alt_contact_number}
                    onChange={(e) => setFormData({ ...formData, alt_contact_number: e.target.value })}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Address Details (Tinted Box) */}
              <div className="booking-address-box">
                <div className="booking-section-header">
                  <div className="booking-section-icon-badge cyan">
                    <MapPin size={18} />
                  </div>
                  <h3 className="booking-section-title">Address Details</h3>
                </div>

                {/* Field 1: Flat,HouseNo */}
                <div className="booking-input-wrap">
                  <input
                    type="text"
                    placeholder="Flat,HouseNo"
                    value={formData.flat_house_no}
                    onChange={(e) => setFormData({ ...formData, flat_house_no: e.target.value })}
                  />
                </div>

                {/* Field 2: Street,Area,Sector,Village */}
                <div className="booking-input-wrap">
                  <Navigation size={16} color="#0891b2" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Street,Area,Sector,Village"
                    value={formData.street_area}
                    onChange={(e) => setFormData({ ...formData, street_area: e.target.value })}
                  />
                </div>

                {/* Field 3: Town,City */}
                <div className="booking-input-wrap">
                  <Building2 size={16} color="#0891b2" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Town,City"
                    value={formData.town_city}
                    onChange={(e) => setFormData({ ...formData, town_city: e.target.value })}
                  />
                </div>

                {/* Field 4: Pincode* */}
                <div className="booking-input-wrap">
                  <Crosshair size={16} color="#0891b2" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Pincode*"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>

                {/* Field 5: Select State / Province / Region* */}
                <fieldset className="booking-state-fieldset">
                  <legend className="booking-state-legend">Select State / Province / Region*</legend>
                  <div className="booking-state-select-wrap">
                    <select
                      className="booking-state-select"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '4px', pointerEvents: 'none' }} />
                  </div>
                </fieldset>
              </div>

            </div>

            {/* SECTION 2: Vehicle & Booking Specifications */}
            <div className="table-card" style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div className="booking-section-header">
                <div className="booking-section-icon-badge">
                  <FileText size={18} />
                </div>
                <h3 className="booking-section-title">Vehicle Details & Financials</h3>
              </div>

              <div className="form-grid-3" style={{ marginBottom: '1.25rem', alignItems: 'start' }}>
                {/* Model Name */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Motorcycle Model*</legend>
                  <select
                    className="outlined-select"
                    value={formData.model_name}
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                  >
                    {BIKE_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </fieldset>

                {/* Color with Stock Selector */}
                <div>
                  <StockNumberSelect
                    fieldType="color"
                    label="Color / Shade"
                    value={formData.color}
                    placeholder="Select or type Color"
                    onChange={(val) => setFormData(prev => ({ ...prev, color: val }))}
                    onSelectStock={handleSelectStock}
                  />
                </div>

                {/* Variant */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Variant</legend>
                  <input
                    type="text"
                    className="outlined-input"
                    placeholder="e.g. Dual Channel ABS Alloy"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                  />
                </fieldset>
              </div>

              <div className="form-grid-3" style={{ marginBottom: '1.25rem' }}>
                {/* Booking Date */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Booking Date*</legend>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="outlined-input"
                      value={formData.booking_date}
                      onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                    />
                    <Calendar size={16} color="#64748b" />
                  </div>
                </fieldset>

                {/* Expected Delivery Date */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Expected Delivery Date</legend>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="outlined-input"
                      value={formData.expected_delivery_date}
                      onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                    />
                    <Calendar size={16} color="#64748b" />
                  </div>
                </fieldset>

                {/* Sales Executive */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Sales Executive / Advisor</legend>
                  <input
                    type="text"
                    className="outlined-input"
                    placeholder="Staff / Advisor Name"
                    value={formData.sales_executive}
                    onChange={(e) => setFormData({ ...formData, sales_executive: e.target.value })}
                  />
                </fieldset>
              </div>

              <div className="form-grid-3" style={{ marginBottom: '1.25rem' }}>
                {/* Total On-Road Price */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Total Estimate Price (₹)*</legend>
                  <input
                    type="number"
                    className="outlined-input"
                    placeholder="225000"
                    value={formData.total_amount}
                    onChange={(e) => handleAmountChange('total_amount', e.target.value)}
                  />
                </fieldset>

                {/* Advance Booking Amount */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Advance Booking Amount (₹)*</legend>
                  <input
                    type="number"
                    className="outlined-input"
                    placeholder="25000"
                    value={formData.booking_amount}
                    onChange={(e) => handleAmountChange('booking_amount', e.target.value)}
                  />
                </fieldset>

                {/* Balance Due */}
                <fieldset className="outlined-fieldset" style={{ backgroundColor: '#f8fafc' }}>
                  <legend className="outlined-legend" style={{ color: '#047857' }}>Balance Amount Due (₹)</legend>
                  <input
                    type="number"
                    readOnly
                    className="outlined-input"
                    style={{ fontWeight: 700, color: '#047857' }}
                    value={formData.balance_amount}
                  />
                </fieldset>
              </div>

              <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
                {/* Payment Mode */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Payment Mode*</legend>
                  <select
                    className="outlined-select"
                    value={formData.payment_mode}
                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                  >
                    <option value="CASH">CASH</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="CARD">DEBIT / CREDIT CARD</option>
                    <option value="NET BANKING">NET BANKING / NEFT</option>
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="FINANCE">VEHICLE FINANCE / EMI</option>
                  </select>
                </fieldset>

                {/* Status */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Order Status</legend>
                  <select
                    className="outlined-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending Allocation">Pending Allocation</option>
                    <option value="Ready for Delivery">Ready for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </fieldset>
              </div>

              {/* Special Instructions / Notes */}
              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Booking Notes / Remarks</legend>
                <textarea
                  className="outlined-textarea"
                  style={{ minHeight: '65px' }}
                  placeholder="Enter accessory requests, insurance details, or customer preferences..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </fieldset>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="form-actions-row" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-save-pill" 
                style={{ padding: '0.65rem 2.5rem', fontSize: '0.95rem' }}
              >
                {loading ? 'Saving...' : 'Save Booking Order'}
              </button>
              <button 
                type="button" 
                onClick={handleClear} 
                className="btn-clear-link"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={15} /> Clear Form
              </button>
            </div>

          </div>
        </form>
      )}

      {/* TAB 2: VIEW LIST */}
      {activeTab === 'view' && (
        <div className="table-card">
          {/* Header Search & Count Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Booking Orders List
              </h3>
              <span className="badge-note-pill">
                {filteredOrders.length} records
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '24px',
              padding: '0.4rem 0.9rem',
              minWidth: '280px'
            }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search by Booking #, Name, Phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <X size={14} color="#64748b" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="karoda-table">
              <thead>
                <tr>
                  <th>Booking No</th>
                  <th>Date</th>
                  <th>Customer Name & S/O</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Vehicle Model</th>
                  <th style={{ textAlign: 'right' }}>Advance Paid</th>
                  <th style={{ textAlign: 'right' }}>Balance Due</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                      No booking orders found. Use the <strong>Entry</strong> tab to create your first booking!
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#6366f1', letterSpacing: '0.02em' }}>
                          {order.booking_no}
                        </span>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                        {order.booking_date}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.customer_name}</div>
                        {order.father_or_spouse_name && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            S/O: {order.father_or_spouse_name}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#334155' }}>
                        <div>{order.contact_number}</div>
                        {order.alt_contact_number && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Alt: {order.alt_contact_number}</div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        <div>{order.town_city || 'CHENNAI'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.state || 'TAMIL NADU'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                          {order.model_name}
                        </div>
                        {order.color && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {order.color} {order.variant ? `• ${order.variant}` : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#047857' }}>
                        ₹{parseFloat(order.booking_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#b91c1c' }}>
                        ₹{parseFloat(order.balance_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className="badge-pill" style={{
                          backgroundColor: order.status === 'Confirmed' ? '#ecfdf5' : '#fef3c7',
                          color: order.status === 'Confirmed' ? '#047857' : '#b45309',
                          border: `1px solid ${order.status === 'Confirmed' ? '#a7f3d0' : '#fde68a'}`,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {order.status || 'Confirmed'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn-icon-circle"
                            onClick={() => setSelectedOrderForPrint(order)}
                            title="Print Booking Voucher"
                            style={{ color: '#6366f1' }}
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-circle"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Booking"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="table-pagination-row">
              <span>Page {currentPage} of {totalPages}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRINTABLE BOOKING ORDER VOUCHER MODAL */}
      {selectedOrderForPrint && (
        <div className="modal-overlay" onClick={() => setSelectedOrderForPrint(null)}>
          <div className="printable-receipt-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Actions Header Bar */}
            <div className="receipt-modal-header receipt-modal-actions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
                <Printer size={18} color="#6366f1" />
                <span>Order Booking Voucher #{selectedOrderForPrint.booking_no}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => window.print()}
                  className="btn-save-pill"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  <Printer size={14} /> Print Voucher
                </button>
                <button 
                  type="button" 
                  className="new-customer-close-btn" 
                  onClick={() => setSelectedOrderForPrint(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div style={{ padding: '1.5rem' }}>
              <div className="printable-receipt-container">
                {/* Header Row */}
                <div className="receipt-header-grid">
                  <div className="receipt-logo-wrap">
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'serif', letterSpacing: '2px', color: '#000000' }}>
                      ROYAL BIKES
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginTop: '2px', textTransform: 'uppercase' }}>
                      Authorised Royal Enfield Dealer
                    </div>
                  </div>

                  <div className="receipt-company-info">
                    <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                      <strong>Head Office:</strong> 42, Mount Road, Nandanam, Chennai - 600035.<br />
                      <strong>GSTIN:</strong> 33AAAAA0000A1Z5 &nbsp;|&nbsp; <strong>Phone:</strong> 044-24356789 / 9941220484<br />
                      <strong>Email:</strong> sales@royalbikes.com &nbsp;|&nbsp; <strong>Web:</strong> www.royalbikes.com
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '1rem 0 0.75rem', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '0.35rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    BOOKING ORDER ADVANCE RECEIPT
                  </h2>
                </div>

                {/* Booking Order Meta Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <div>
                    <div><strong>Booking No:</strong> <span className="dotted-underline-field">{selectedOrderForPrint.booking_no}</span></div>
                    <div style={{ marginTop: '0.4rem' }}><strong>Customer Name:</strong> <span style={{ fontWeight: 'bold' }}>{selectedOrderForPrint.customer_name}</span></div>
                    {selectedOrderForPrint.father_or_spouse_name && (
                      <div style={{ marginTop: '0.25rem' }}><strong>S/O:</strong> {selectedOrderForPrint.father_or_spouse_name}</div>
                    )}
                    <div style={{ marginTop: '0.25rem' }}><strong>Contact No:</strong> {selectedOrderForPrint.contact_number} {selectedOrderForPrint.alt_contact_number ? `/ ${selectedOrderForPrint.alt_contact_number}` : ''}</div>
                    <div style={{ marginTop: '0.25rem' }}><strong>Address:</strong> {[selectedOrderForPrint.flat_house_no, selectedOrderForPrint.street_area, selectedOrderForPrint.town_city, selectedOrderForPrint.state, selectedOrderForPrint.pincode].filter(Boolean).join(', ')}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div><strong>Booking Date:</strong> <span className="dotted-underline-field">{selectedOrderForPrint.booking_date}</span></div>
                    <div style={{ marginTop: '0.4rem' }}><strong>Exp. Delivery Date:</strong> {selectedOrderForPrint.expected_delivery_date || '-'}</div>
                    <div style={{ marginTop: '0.25rem' }}><strong>Sales Advisor:</strong> {selectedOrderForPrint.sales_executive || 'Store Manager'}</div>
                    <div style={{ marginTop: '0.25rem' }}><strong>Status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{selectedOrderForPrint.status}</span></div>
                  </div>
                </div>

                {/* Vehicle Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #000' }}>
                      <th style={{ padding: '0.5rem', borderRight: '1px solid #000', textAlign: 'left' }}>Sl</th>
                      <th style={{ padding: '0.5rem', borderRight: '1px solid #000', textAlign: 'left' }}>Motorcycle Description & Variant</th>
                      <th style={{ padding: '0.5rem', borderRight: '1px solid #000', textAlign: 'left' }}>Color</th>
                      <th style={{ padding: '0.5rem', borderRight: '1px solid #000', textAlign: 'right' }}>Est. On-Road Price</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Advance Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.6rem 0.5rem', borderRight: '1px solid #000' }}>1</td>
                      <td style={{ padding: '0.6rem 0.5rem', borderRight: '1px solid #000', fontWeight: 'bold' }}>
                        {selectedOrderForPrint.model_name}
                        {selectedOrderForPrint.variant && <div style={{ fontSize: '0.78rem', fontWeight: 'normal', color: '#444' }}>Variant: {selectedOrderForPrint.variant}</div>}
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', borderRight: '1px solid #000' }}>
                        {selectedOrderForPrint.color || 'Standard'}
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', borderRight: '1px solid #000', textAlign: 'right' }}>
                        ₹{parseFloat(selectedOrderForPrint.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: 'bold' }}>
                        ₹{parseFloat(selectedOrderForPrint.booking_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #000', background: '#f8fafc', fontWeight: 'bold' }}>
                      <td colSpan="4" style={{ padding: '0.5rem', textAlign: 'right', borderRight: '1px solid #000' }}>
                        Total Advance Received ({selectedOrderForPrint.payment_mode}):
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        ₹{parseFloat(selectedOrderForPrint.booking_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>
                      <td colSpan="4" style={{ padding: '0.5rem', textAlign: 'right', borderRight: '1px solid #000', color: '#991B1B' }}>
                        Approximate Balance Due on Delivery:
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', color: '#991B1B' }}>
                        ₹{parseFloat(selectedOrderForPrint.balance_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Terms and Signatures */}
                <div style={{ fontSize: '0.78rem', color: '#333', lineHeight: '1.4', marginBottom: '2rem' }}>
                  <strong>Terms & Conditions:</strong><br />
                  1. Booking is subject to vehicle allocation and manufacturer price ruling at the time of invoicing.<br />
                  2. Full payment and insurance documentation must be completed prior to vehicle registration & delivery.<br />
                  3. In case of cancellation, standard processing charges may apply as per Royal Enfield dealership policy.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid #999', fontSize: '0.85rem' }}>
                  <div style={{ textAlign: 'center', width: '200px' }}>
                    <div style={{ borderBottom: '1px solid #000', marginBottom: '0.4rem', height: '30px' }}></div>
                    Customer's Signature
                  </div>
                  <div style={{ textAlign: 'center', width: '220px' }}>
                    <div style={{ borderBottom: '1px solid #000', marginBottom: '0.4rem', height: '30px' }}></div>
                    For ROYAL BIKES (Authorised Signatory)
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
