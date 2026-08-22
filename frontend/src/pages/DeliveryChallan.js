import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Home, 
  Calendar, 
  Search, 
  Printer, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Target,
  Building,
  PlusCircle,
  UserCheck
} from 'lucide-react';
import { deliveryChallanService } from '../services/deliveryChallanService';

export const DeliveryChallan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on current path
  const isViewRoute = location.pathname.endsWith('/view');
  const [activeTab, setActiveTab] = useState(isViewRoute ? 'view' : 'entry');

  useEffect(() => {
    setActiveTab(location.pathname.endsWith('/view') ? 'view' : 'entry');
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'view') {
      navigate('/delivery-challan/view');
    } else {
      navigate('/delivery-challan/entry');
    }
  };

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sample Customer Database for Dropdown
  const [customerList, setCustomerList] = useState([
    { id: 1, name: 'BALAJI PANNER SELVAM', city: 'CHENNAI', mob: '9941220484' },
    { id: 2, name: 'G . RAMESH GANDHI', city: 'CHENNAI', mob: '9791734097' },
    { id: 3, name: 'ARASU GOVINDHU', city: 'CHENNAI', mob: '9840897744' },
    { id: 4, name: 'MOHAMMED SALIM K KADHAR GANI', city: 'CHENNAI', mob: '9025784525' }
  ]);

  // Dropdown & New Customer Modal state
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    flatHouseNo: '',
    streetArea: '',
    landmark: '',
    pincode: '',
    townCity: 'CHENNAI',
    state: 'TAMIL NADU'
  });

  // Initial Sample Delivery Challan Data
  const [challans, setChallans] = useState([
    {
      id: 1,
      dc_number: 'DC-2026-001',
      order_date: '12-08-2026',
      expected_shipment_date: '12-08-2026',
      sales_type: 'GST',
      reference_no: 'REF-98120',
      customer_name: 'BALAJI PANNER SELVAM',
      customer_phone: '9941220484',
      customer_address: 'CHENNAI',
      product_name: 'Royal Enfield Classic 350',
      quantity: 1,
      engine_number: 'ENG-350-7712',
      chassis_number: 'CHS-RE-9941',
      color: 'Stealth Black',
      delivery_terms: 'Immediate delivery',
      notes: 'Sample Delivery Challan entry',
      status: 'Delivered'
    }
  ]);

  // Form State for Entry Tab
  const [formData, setFormData] = useState({
    order_date: '12-08-2026',
    expected_shipment_date: '12-08-2026',
    sales_type: 'GST',
    reference_no: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    product_name: 'Royal Enfield Classic 350',
    quantity: 1,
    engine_number: '',
    chassis_number: '',
    color: '',
    delivery_terms: '',
    notes: ''
  });

  // Filter & Search State for View Tab
  const [filters, setFilters] = useState({
    fromDate: '12-08-2026',
    toDate: '12-08-2026'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Printable Delivery Challan Modal
  const [selectedDcForPrint, setSelectedDcForPrint] = useState(null);

  // Fetch Delivery Challans from backend
  const loadDeliveryChallans = async () => {
    setLoading(true);
    try {
      const res = await deliveryChallanService.getDeliveryChallans();
      if (res.success && res.data && res.data.length > 0) {
        setChallans(res.data);
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable, using local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveryChallans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCustomer = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customer_name: customer.name,
      customer_phone: customer.mob,
      customer_address: customer.city
    }));
    setIsCustomerDropdownOpen(false);
  };

  const handleCreateNewCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerForm.firstName || !newCustomerForm.phone) {
      alert('First Name and Phone Number are required!');
      return;
    }

    const fullName = `${newCustomerForm.firstName} ${newCustomerForm.lastName}`.trim().toUpperCase();
    const createdCust = {
      id: Date.now(),
      name: fullName,
      city: newCustomerForm.streetArea || newCustomerForm.flatHouseNo || 'CHENNAI',
      mob: newCustomerForm.phone
    };

    setCustomerList([createdCust, ...customerList]);
    handleSelectCustomer(createdCust);
    setIsAddCustomerModalOpen(false);
    setNewCustomerForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      flatHouseNo: '',
      streetArea: '',
      landmark: '',
      pincode: '',
      townCity: 'CHENNAI',
      state: 'TAMIL NADU'
    });
  };

  const handleClear = () => {
    setFormData({
      order_date: '12-08-2026',
      expected_shipment_date: '12-08-2026',
      sales_type: 'GST',
      reference_no: '',
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      product_name: 'Royal Enfield Classic 350',
      quantity: 1,
      engine_number: '',
      chassis_number: '',
      color: '',
      delivery_terms: '',
      notes: ''
    });
  };

  const handleSubmitEntry = async (e) => {
    if (e) e.preventDefault();
    if (!formData.customer_name.trim()) {
      alert('Please select or add a Customer Name');
      return;
    }
    if (!formData.engine_number.trim() || !formData.chassis_number.trim() || !formData.color.trim()) {
      alert('Please fill out required fields marked with * (Engine Number, Chassis Number, Color)');
      return;
    }

    const nextNo = `DC-2026-${String(challans.length + 1).padStart(3, '0')}`;
    const newEntry = {
      ...formData,
      dc_number: nextNo,
      status: 'Delivered'
    };

    try {
      const res = await deliveryChallanService.createDeliveryChallan(newEntry);
      if (res.success && res.data) {
        setChallans((prev) => [res.data, ...prev]);
      } else {
        setChallans((prev) => [{ id: Date.now(), ...newEntry }, ...prev]);
      }
    } catch (err) {
      setChallans((prev) => [{ id: Date.now(), ...newEntry }, ...prev]);
    }

    setSuccessMessage(`Delivery Challan #${newEntry.dc_number} saved successfully!`);
    setTimeout(() => setSuccessMessage(''), 4000);
    handleClear();
    handleTabChange('view');
  };

  const handleDeleteChallan = async (id) => {
    if (window.confirm('Are you sure you want to delete this Delivery Challan entry?')) {
      try {
        await deliveryChallanService.deleteDeliveryChallan(id);
      } catch (err) {
        // fallback local removal
      }
      setChallans((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Filtered & Searched data
  const filteredChallans = challans.filter((item) => {
    const matchesSearch = 
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dc_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.product_name && item.product_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.engine_number && item.engine_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.chassis_number && item.chassis_number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredChallans.length / itemsPerPage) || 1;
  const paginatedChallans = filteredChallans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header & Breadcrumb Trail Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="page-title-icon">
            <Truck size={22} />
          </div>
          <div>
            <div className="page-title-text" style={{ margin: 0, fontSize: '1.45rem' }}>
              {activeTab === 'view' ? 'Delivery-Challan View' : 'Delivery-Challan'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
              <Home size={13} color="#94a3b8" />
              <span>•</span>
              <span>Transaction</span>
              <span>•</span>
              <span>Sales</span>
              <span>•</span>
              <span style={{ fontWeight: 600, color: '#475569' }}>Delivery-Challan</span>
            </div>
          </div>
        </div>

        {/* Top Right Action Button */}
        {activeTab === 'entry' && (
          <button 
            type="button" 
            onClick={handleSubmitEntry}
            className="btn-save-pill"
            style={{ padding: '0.6rem 2.2rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)' }}
          >
            Save
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
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

      {/* Success Notification Alert */}
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

      {/* TAB 1: ENTRY FORM */}
      {activeTab === 'entry' && (
        <form onSubmit={handleSubmitEntry} style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Row 1: Dates & Customer Details Lookup */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1.25rem' }}>
              <div>
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <legend className="outlined-legend">Order Date</legend>
                  <input
                    type="text"
                    name="order_date"
                    value={formData.order_date}
                    onChange={handleInputChange}
                    className="outlined-input"
                  />
                  <Calendar size={18} color="#64748b" />
                </fieldset>
              </div>

              <div>
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <legend className="outlined-legend">Expected Shipment Date</legend>
                  <input
                    type="text"
                    name="expected_shipment_date"
                    value={formData.expected_shipment_date}
                    onChange={handleInputChange}
                    className="outlined-input"
                  />
                  <Calendar size={18} color="#64748b" />
                </fieldset>
              </div>

              {/* Customer Search Dropdown */}
              <div style={{ position: 'relative' }}>
                <fieldset className="outlined-fieldset" style={{ cursor: 'pointer' }} onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}>
                  <legend className="outlined-legend">Search from Customerdetails</legend>
                  <input
                    type="text"
                    value={formData.customer_name}
                    placeholder="Search or Select Customer..."
                    readOnly
                    className="outlined-input"
                    style={{ cursor: 'pointer' }}
                  />
                </fieldset>

                {/* Dropdown Options Box */}
                {isCustomerDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                    marginTop: '4px',
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}>
                    {/* Add New Customer Option */}
                    <div 
                      onClick={() => {
                        setIsCustomerDropdownOpen(false);
                        setIsAddCustomerModalOpen(true);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f1f5f9',
                        color: '#6366f1',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <span>( Add New Customer )</span>
                      <CheckCircle2 size={16} />
                    </div>

                    {/* Customer Results */}
                    {customerList.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => handleSelectCustomer(cust)}
                        style={{
                          padding: '0.65rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a' }}>
                          {cust.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                          City : {cust.city} &nbsp; Mob: {cust.mob}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Sales Type & Reference# */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Sales Type*</legend>
                <select
                  name="sales_type"
                  value={formData.sales_type}
                  onChange={handleInputChange}
                  className="outlined-select"
                >
                  <option value="GST">GST</option>
                  <option value="NON-GST">NON-GST</option>
                  <option value="EXPORT">EXPORT</option>
                </select>
              </fieldset>

              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Reference#</legend>
                <input
                  type="text"
                  name="reference_no"
                  value={formData.reference_no}
                  onChange={handleInputChange}
                  className="outlined-input"
                />
              </fieldset>
            </div>

            {/* Row 3: Product, Quantity, Vehicle Info */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Product</legend>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="outlined-input"
              />
            </fieldset>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: '1.25rem' }}>
              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Quantity</legend>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="outlined-input"
                />
              </fieldset>

              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Engine Number *</legend>
                <input
                  type="text"
                  name="engine_number"
                  value={formData.engine_number}
                  onChange={handleInputChange}
                  className="outlined-input"
                />
              </fieldset>

              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Chassis Number *</legend>
                <input
                  type="text"
                  name="chassis_number"
                  value={formData.chassis_number}
                  onChange={handleInputChange}
                  className="outlined-input"
                />
              </fieldset>

              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Color *</legend>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="outlined-input"
                />
              </fieldset>
            </div>

            {/* Row 4: Delivery Terms & Notes */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Delivery Terms</legend>
              <input
                type="text"
                name="delivery_terms"
                value={formData.delivery_terms}
                onChange={handleInputChange}
                className="outlined-input"
              />
            </fieldset>

            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Notes</legend>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="outlined-textarea"
                rows={3}
              />
            </fieldset>

            {/* Form Action Buttons */}
            <div className="form-actions-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn-save-pill" style={{ minWidth: '120px' }}>
                Save
              </button>
              <button type="button" onClick={handleClear} className="btn-clear-link">
                Clear
              </button>
            </div>

          </div>
        </form>
      )}

      {/* TAB 2: VIEW DELIVERY CHALLANS */}
      {activeTab === 'view' && (
        <div>
          {/* Top Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <legend className="outlined-legend">FromDate</legend>
                <input
                  type="text"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="outlined-input"
                />
                <Calendar size={18} color="#64748b" />
              </fieldset>
              <div className="field-subtext">Click on the input or the datepicker icon</div>
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <legend className="outlined-legend">ToDate</legend>
                <input
                  type="text"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="outlined-input"
                />
                <Calendar size={18} color="#64748b" />
              </fieldset>
              <div className="field-subtext">Click on the input or the datepicker icon</div>
            </div>

            <div style={{ paddingTop: '0.2rem' }}>
              <button type="button" className="btn-save-pill" style={{ padding: '0.65rem 2rem' }}>
                Submit
              </button>
            </div>
          </div>

          {/* Table Card Container */}
          <div className="table-card">
            {/* Search Header Banner */}
            <div className="receipt-search-banner">
              <div className="receipt-search-box">
                <Search size={18} color="rgba(255,255,255,0.8)" />
                <input
                  type="text"
                  placeholder="Type here to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Delivery Challan Table */}
            <div className="table-responsive">
              <table className="karoda-table">
                <thead>
                  <tr>
                    <th>Print</th>
                    <th>DC NUMBER</th>
                    <th>CUSTOMER NAME</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedChallans.length > 0 ? (
                    paginatedChallans.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <button
                            type="button"
                            className="btn-icon-circle"
                            title="Print Delivery Challan"
                            onClick={() => setSelectedDcForPrint(row)}
                          >
                            <Printer size={18} color="#475569" />
                          </button>
                        </td>
                        <td style={{ fontWeight: 700, color: '#6366f1' }}>{row.dc_number}</td>
                        <td style={{ fontWeight: 600 }}>{row.customer_name}</td>
                        <td>
                          <span className="badge-note-pill" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
                            {row.status || 'Delivered'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        No delivery challan records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="table-pagination-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Items per page:</span>
                <select
                  className="pagination-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                {filteredChallans.length > 0
                  ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredChallans.length)} of ${filteredChallans.length}`
                  : '0 of 0'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Bottom Footer Banner */}
      <div className="page-footer-banner">
        <div className="badge-gst-software">
          <ShoppingBag size={16} />
          <span>GST Billing Software</span>
        </div>
        <div className="footer-copyright-text">
          Copyright ©2026 All rights reserved
        </div>
      </div>

      {/* NEW CUSTOMER MODAL (Matching Image 5) */}
      {isAddCustomerModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddCustomerModalOpen(false)}>
          <div className="printable-receipt-card" style={{ maxWidth: '520px', borderRadius: '12px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header" style={{ borderBottom: 'none', padding: '1.25rem 1.5rem 0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                New Customer
              </h3>
              <button
                type="button"
                className="btn-icon-circle"
                onClick={() => setIsAddCustomerModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewCustomer} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                
                {/* First Name & Last Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <legend className="outlined-legend">First Name*</legend>
                    <User size={16} color="#64748b" />
                    <input
                      type="text"
                      required
                      value={newCustomerForm.firstName}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, firstName: e.target.value })}
                      className="outlined-input"
                    />
                  </fieldset>

                  <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <legend className="outlined-legend">Last Name</legend>
                    <User size={16} color="#64748b" />
                    <input
                      type="text"
                      value={newCustomerForm.lastName}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, lastName: e.target.value })}
                      className="outlined-input"
                    />
                  </fieldset>
                </div>

                {/* Phone Number */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Phone Number*</legend>
                  <Phone size={16} color="#64748b" />
                  <input
                    type="text"
                    required
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Email */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Email</legend>
                  <Mail size={16} color="#64748b" />
                  <input
                    type="email"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Flat, HouseNo */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Flat,HouseNo</legend>
                  <input
                    type="text"
                    value={newCustomerForm.flatHouseNo}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, flatHouseNo: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Street, Area, Sector, Village */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Street,Area,Sector,Village</legend>
                  <MapPin size={16} color="#64748b" />
                  <input
                    type="text"
                    value={newCustomerForm.streetArea}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, streetArea: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Landmark */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Landmark</legend>
                  <input
                    type="text"
                    value={newCustomerForm.landmark}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, landmark: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Pincode * */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Pincode *</legend>
                  <Target size={16} color="#64748b" />
                  <input
                    type="text"
                    value={newCustomerForm.pincode}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, pincode: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Town,City */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Town,City</legend>
                  <Building size={16} color="#64748b" />
                  <input
                    type="text"
                    value={newCustomerForm.townCity}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, townCity: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Select State / Province / Region * */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Select State / Province / Region*</legend>
                  <select
                    value={newCustomerForm.state}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, state: e.target.value })}
                    className="outlined-select"
                  >
                    <option value="TAMIL NADU">TAMIL NADU</option>
                    <option value="KARNATAKA">KARNATAKA</option>
                    <option value="KERALA">KERALA</option>
                    <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                    <option value="TELANGANA">TELANGANA</option>
                    <option value="MAHARASHTRA">MAHARASHTRA</option>
                    <option value="DELHI">DELHI</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </fieldset>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.25rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddCustomerModalOpen(false)}
                    className="btn-clear-link"
                    style={{ textTransform: 'uppercase', fontSize: '0.85rem', color: '#475569' }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn-save-pill"
                    style={{ padding: '0.55rem 1.75rem', fontSize: '0.88rem' }}
                  >
                    Add Customer
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE DELIVERY CHALLAN INVOICE MODAL */}
      {selectedDcForPrint && (
        <div className="modal-overlay" onClick={() => setSelectedDcForPrint(null)}>
          <div className="printable-receipt-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header receipt-modal-actions-bar">
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Delivery Challan Preview - #{selectedDcForPrint.dc_number}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-save-pill"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1.25rem', fontSize: '0.88rem' }}
                >
                  <Printer size={16} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  className="btn-icon-circle"
                  onClick={() => setSelectedDcForPrint(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#ffffff', overflowY: 'auto' }}>
              <div className="printable-receipt-container">
                {/* Header Grid */}
                <div className="receipt-header-grid">
                  <div className="receipt-logo-wrap">
                    <svg width="60" height="34" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="5.5" cy="17.5" r="3.5"/>
                      <circle cx="18.5" cy="17.5" r="3.5"/>
                      <path d="M15 6h2.57a2 2 0 0 1 1.96 1.62l1.04 5.22"/>
                      <path d="M9 17.5h6"/>
                      <path d="M5.5 17.5 9 10l3 3 3.5-7"/>
                    </svg>
                    <div style={{
                      fontWeight: '900',
                      fontSize: '1rem',
                      letterSpacing: '0.08em',
                      fontFamily: "'Arial Black', sans-serif",
                      borderTop: '2px solid #000000',
                      borderBottom: '2px solid #000000',
                      padding: '1px 0',
                      marginTop: '2px',
                      width: '120px'
                    }}>
                      ROYAL
                      <div style={{ fontSize: '0.8rem', letterSpacing: '0.22em' }}>BIKES</div>
                    </div>
                  </div>

                  <div className="receipt-company-info">
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 'bold', margin: '0 0 0.15rem 0', textTransform: 'uppercase', fontFamily: "'Times New Roman', serif" }}>
                      ROYAL BIKES
                    </h2>
                    <div style={{ fontSize: '0.78rem', color: '#000000', lineHeight: 1.35, fontFamily: "'Times New Roman', serif" }}>
                      104/1, ERUKKANCHERY HIGH ROAD,SHARMA NAGAR, VYASARPADI<br />
                      CHENNAI-600039 (ANNAI DIGITAL OPPOSITE)<br />
                      E-mail : royalbikes2020@gmail.com
                    </div>
                  </div>
                </div>

                {/* Contact Pills Row */}
                <div className="contact-pills-row">
                  <div className="contact-pill-item">
                    <div className="contact-pill-label">LAND LINE</div>
                    <div className="contact-pill-value">04443537237</div>
                  </div>
                  <div className="contact-pill-item">
                    <div className="contact-pill-label">RTO</div>
                    <div className="contact-pill-value">8925270575</div>
                  </div>
                  <div className="contact-pill-item">
                    <div className="contact-pill-label">SALES</div>
                    <div className="contact-pill-value">6369308779</div>
                  </div>
                  <div className="contact-pill-item">
                    <div className="contact-pill-label">CUSTOMER CARE</div>
                    <div className="contact-pill-value">9677037270</div>
                  </div>
                </div>

                <div style={{ borderTop: '1.5px solid #000000', margin: '0.85rem 0 1.25rem' }}></div>

                {/* Document Title */}
                <div style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                  DELIVERY CHALLAN
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem', marginBottom: '1.25rem', border: '1px solid #000', padding: '0.85rem', borderRadius: '4px' }}>
                  <div>
                    <strong>DC Number:</strong> {selectedDcForPrint.dc_number}<br />
                    <strong>Order Date:</strong> {selectedDcForPrint.order_date}<br />
                    <strong>Expected Shipment:</strong> {selectedDcForPrint.expected_shipment_date}
                  </div>
                  <div>
                    <strong>Customer Name:</strong> {selectedDcForPrint.customer_name}<br />
                    <strong>Phone:</strong> {selectedDcForPrint.customer_phone || '9941220484'}<br />
                    <strong>Address:</strong> {selectedDcForPrint.customer_address || 'CHENNAI'}
                  </div>
                </div>

                {/* Product Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Product Particulars</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Engine Number</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Chassis Number</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>{selectedDcForPrint.product_name}</td>
                      <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>{selectedDcForPrint.quantity}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>{selectedDcForPrint.engine_number || 'ENG-350-7712'}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>{selectedDcForPrint.chassis_number || 'CHS-RE-9941'}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>{selectedDcForPrint.color || 'Stealth Black'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3.5rem', padding: '0 0.5rem' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Authorised Signature
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    Receiver's Signature
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
