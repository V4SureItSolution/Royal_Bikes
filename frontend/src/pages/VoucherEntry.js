import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Calendar, 
  Search, 
  Printer, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { voucherService } from '../services/voucherService';
import { CustomerSearchSelect } from '../components/CustomerSearchSelect';

// Helper to convert number to words
const numberToWords = (num) => {
  const n = parseInt(num, 10);
  if (isNaN(n) || n <= 0) return 'zero rupees only';
  
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const convert = (val) => {
    if (val < 20) return units[val];
    if (val < 100) return tens[Math.floor(val / 10)] + (val % 10 ? ' ' + units[val % 10] : '');
    if (val < 1000) return units[Math.floor(val / 100)] + ' hundred' + (val % 100 ? ' ' + convert(val % 100) : '');
    if (val < 100000) return convert(Math.floor(val / 1000)) + ' thousand' + (val % 1000 ? ' ' + convert(val % 1000) : '');
    if (val < 10000000) return convert(Math.floor(val / 100000)) + ' lakh' + (val % 100000 ? ' ' + convert(val % 100000) : '');
    return convert(Math.floor(val / 10000000)) + ' crore' + (val % 10000000 ? ' ' + convert(val % 10000000) : '');
  };

  return convert(n) + ' only';
};

// Date Formatter: YYYY-MM-DD -> DD-MM-YYYY
const formatToDDMMYYYY = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  }
  return dateStr;
};

export const VoucherEntry = () => {
  const [activeTab, setActiveTab] = useState('entry'); // 'entry' | 'view'
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Date picker refs
  const receiptDateRef = useRef(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  // Vouchers Data List
  const [vouchers, setVouchers] = useState([]);

  const [customerList, setCustomerList] = useState([
    { id: 1, name: 'VP GI BOOMIKA', city: 'CHENNAI', mob: '9876543210' },
    { id: 2, name: 'BALAJI PANNER SELVAM', city: 'CHENNAI', mob: '9941220484' },
    { id: 3, name: 'G . RAMESH GANDHI', city: 'CHENNAI', mob: '9791734097' },
    { id: 4, name: 'SURESH KUMAR', city: 'CHENNAI', mob: '9840897744' }
  ]);

  // Form State for Entry Tab
  const [formData, setFormData] = useState({
    account_code: '',
    customer_name: '',
    voucher_date: '12-08-2026',
    amount: '0',
    payment_type: '',
    note: ''
  });

  // Filter & Search State for View Tab
  const [filters, setFilters] = useState({
    fromDate: '12-08-2026',
    toDate: '12-08-2026'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State for Printable Voucher
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState(null);

  // Fetch vouchers from backend
  const loadVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherService.getVouchers();
      if (res.success && res.data && res.data.length > 0) {
        setVouchers(res.data);
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable, using local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDatePick = (field, e) => {
    const formatted = formatToDDMMYYYY(e.target.value);
    if (field === 'voucher_date') {
      setFormData((prev) => ({ ...prev, voucher_date: formatted }));
    } else if (field === 'fromDate') {
      setFilters((prev) => ({ ...prev, fromDate: formatted }));
    } else if (field === 'toDate') {
      setFilters((prev) => ({ ...prev, toDate: formatted }));
    }
  };

  const openDatePicker = (ref) => {
    if (ref.current) {
      if (typeof ref.current.showPicker === 'function') {
        ref.current.showPicker();
      } else {
        ref.current.focus();
        ref.current.click();
      }
    }
  };

  const handleClear = () => {
    setFormData({
      account_code: '',
      customer_name: '',
      voucher_date: '12-08-2026',
      amount: '0',
      payment_type: '',
      note: ''
    });
  };

  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    if (!formData.customer_name.trim()) {
      alert('Please enter Customer Name');
      return;
    }
    if (!formData.payment_type) {
      alert('Please select Payment Type');
      return;
    }

    const nextNo = String(vouchers.length + 4889).padStart(5, '0');
    const newEntry = {
      account_code: formData.account_code || '2852',
      customer_name: formData.customer_name.toUpperCase(),
      voucher_date: formData.voucher_date || '12-08-2026',
      amount: parseFloat(formData.amount) || 0,
      payment_type: formData.payment_type,
      note: formData.note.trim() || '-',
      voucher_no: nextNo,
      status: 'active'
    };

    try {
      const res = await voucherService.createVoucher(newEntry);
      if (res.success && res.data) {
        setVouchers((prev) => [res.data, ...prev]);
      } else {
        setVouchers((prev) => [{ id: Date.now(), ...newEntry }, ...prev]);
      }
    } catch (err) {
      setVouchers((prev) => [{ id: Date.now(), ...newEntry }, ...prev]);
    }

    setSuccessMessage(`Voucher #${newEntry.voucher_no} created successfully!`);
    setTimeout(() => setSuccessMessage(''), 4000);
    handleClear();
    setActiveTab('view');
  };

  const handleDeleteVoucher = async (id) => {
    if (window.confirm('Are you sure you want to delete this voucher entry?')) {
      try {
        await voucherService.deleteVoucher(id);
      } catch (err) {
        // fallback local removal
      }
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Filtered & Searched data
  const filteredVouchers = vouchers.filter((item) => {
    const matchesSearch = 
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.voucher_no.includes(searchQuery) ||
      (item.account_code && item.account_code.includes(searchQuery)) ||
      item.payment_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage) || 1;
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header Title Section */}
      <div className="page-title-header">
        <div className="page-title-icon">
          <FileText size={20} />
        </div>
        <div className="page-title-text">Voucher-Entry</div>
      </div>

      {/* Navigation Tabs */}
      <div className="karoda-tabs-wrap">
        <button
          className={`karoda-tab ${activeTab === 'entry' ? 'active' : ''}`}
          onClick={() => setActiveTab('entry')}
        >
          Entry
        </button>
        <button
          className={`karoda-tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
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
        <form onSubmit={handleSubmitEntry} style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Account Code */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Account Code</legend>
              <input
                type="text"
                name="account_code"
                value={formData.account_code}
                onChange={handleInputChange}
                className="outlined-input"
              />
            </fieldset>

            {/* Customer Name Lookup */}
            <CustomerSearchSelect
              selectedCustomerName={formData.customer_name}
              onSelectCustomer={(cust) => setFormData((prev) => ({ ...prev, customer_name: cust.name }))}
              customerList={customerList}
              setCustomerList={setCustomerList}
            />

            {/* Receipt Date */}
            <div>
              <fieldset 
                className="outlined-fieldset" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => openDatePicker(receiptDateRef)}
              >
                <legend className="outlined-legend">Receipt Date</legend>
                <input
                  type="text"
                  name="voucher_date"
                  value={formData.voucher_date}
                  onChange={handleInputChange}
                  className="outlined-input"
                  style={{ cursor: 'pointer' }}
                />
                <Calendar size={18} color="#475569" style={{ cursor: 'pointer' }} />
                <input 
                  type="date" 
                  ref={receiptDateRef} 
                  onChange={(e) => handleDatePick('voucher_date', e)} 
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} 
                />
              </fieldset>
              <div className="field-subtext">Click on the input or the datepicker icon</div>
            </div>

            {/* Amount */}
            <div>
              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Amount</legend>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="outlined-input"
                />
              </fieldset>
            </div>

            {/* Payment Type * Dropdown */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Payment Type *</legend>
              <select
                name="payment_type"
                value={formData.payment_type}
                onChange={handleInputChange}
                className="outlined-select"
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="" disabled hidden>Select Payment Type</option>
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="UPI">UPI</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="ONLINE">ONLINE</option>
              </select>
            </fieldset>

            {/* Note */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Note</legend>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="outlined-input"
              />
            </fieldset>

            {/* Action Buttons */}
            <div className="form-actions-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn-save-pill" style={{ minWidth: '120px' }}>
                Submit
              </button>
              <button type="button" onClick={handleClear} className="btn-clear-link">
                Cancel
              </button>
            </div>

          </div>
        </form>
      )}

      {/* TAB 2: VIEW VOUCHERS & FILTER TABLE */}
      {activeTab === 'view' && (
        <div>
          {/* Top Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <fieldset 
                className="outlined-fieldset" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => openDatePicker(fromDateRef)}
              >
                <legend className="outlined-legend">FromDate</legend>
                <input
                  type="text"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="outlined-input"
                  style={{ cursor: 'pointer' }}
                />
                <Calendar size={18} color="#475569" />
                <input 
                  type="date" 
                  ref={fromDateRef} 
                  onChange={(e) => handleDatePick('fromDate', e)} 
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} 
                />
              </fieldset>
              <div className="field-subtext">Click on the input or the datepicker icon</div>
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <fieldset 
                className="outlined-fieldset" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => openDatePicker(toDateRef)}
              >
                <legend className="outlined-legend">ToDate</legend>
                <input
                  type="text"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="outlined-input"
                  style={{ cursor: 'pointer' }}
                />
                <Calendar size={18} color="#475569" />
                <input 
                  type="date" 
                  ref={toDateRef} 
                  onChange={(e) => handleDatePick('toDate', e)} 
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} 
                />
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
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Vouchers Table */}
            <div className="table-responsive">
              <table className="karoda-table">
                <thead>
                  <tr>
                    <th>Print</th>
                    <th>DATE</th>
                    <th>VOUCHERNO</th>
                    <th>ACCT.NO</th>
                    <th>CUSTOMER NAME</th>
                    <th>AMOUNT</th>
                    <th>NOTE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVouchers.length > 0 ? (
                    paginatedVouchers.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <button
                            type="button"
                            className="btn-icon-circle"
                            title="Print Voucher"
                            onClick={() => setSelectedVoucherForPrint(row)}
                          >
                            <Printer size={18} color="#475569" />
                          </button>
                        </td>
                        <td>{row.voucher_date}</td>
                        <td>{row.voucher_no}</td>
                        <td>{row.account_code || '-'}</td>
                        <td style={{ fontWeight: 600 }}>{row.customer_name}</td>
                        <td>{row.amount}</td>
                        <td>
                          <span className="badge-note-pill">{row.note || '-'}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-icon-circle"
                            title="Delete / Cancel Voucher"
                            onClick={() => handleDeleteVoucher(row.id)}
                            style={{ border: '1px solid #e2e8f0' }}
                          >
                            <X size={16} color="#64748b" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        No voucher records found.
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
                {filteredVouchers.length > 0
                  ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredVouchers.length)} of ${filteredVouchers.length}`
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

      {/* Printable Voucher Modal */}
      {selectedVoucherForPrint && (
        <div className="modal-overlay" onClick={() => setSelectedVoucherForPrint(null)}>
          <div className="printable-receipt-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header receipt-modal-actions-bar">
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                Voucher Preview - #{selectedVoucherForPrint.voucher_no}
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
                  onClick={() => setSelectedVoucherForPrint(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#ffffff', overflowY: 'auto' }}>
              {/* Printable Voucher Box */}
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

                {/* Divider Line */}
                <div style={{ borderTop: '1px solid #777777', margin: '0.85rem 0 1.25rem' }}></div>

                {/* Voucher Content Body */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      VOUCHER NO: {selectedVoucherForPrint.voucher_no}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      Date : {selectedVoucherForPrint.voucher_date ? selectedVoucherForPrint.voucher_date.replace(/-/g, '/') : '12/08/2026'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.35rem', fontSize: '1.1rem' }}>
                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Customer Name :</span>
                    <span style={{ 
                      borderBottom: '1px dotted #000000', 
                      flex: 1, 
                      marginLeft: '0.5rem', 
                      fontWeight: 'bold', 
                      fontSize: '1.2rem',
                      paddingLeft: '0.5rem' 
                    }}>
                      {selectedVoucherForPrint.customer_name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '2rem', marginBottom: '1.35rem', fontSize: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', flex: 1.2 }}>
                      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Amount :</span>
                      <span style={{ 
                        borderBottom: '1px dotted #000000', 
                        flex: 1, 
                        marginLeft: '0.5rem', 
                        fontWeight: 'bold', 
                        fontSize: '1.2rem',
                        paddingLeft: '0.5rem' 
                      }}>
                        {selectedVoucherForPrint.amount}/-
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
                      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>A/c No :</span>
                      <span style={{ 
                        borderBottom: '1px dotted #000000', 
                        flex: 1, 
                        marginLeft: '0.5rem', 
                        fontWeight: 'bold', 
                        fontSize: '1.2rem',
                        paddingLeft: '0.5rem' 
                      }}>
                        {selectedVoucherForPrint.account_code || '2852'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Sum of Rupees :</span>
                    <span style={{ 
                      borderBottom: '1px dotted #000000', 
                      flex: 1, 
                      marginLeft: '0.5rem', 
                      fontWeight: 'bold', 
                      fontSize: '1.15rem',
                      paddingLeft: '0.5rem',
                      textTransform: 'lowercase'
                    }}>
                      {numberToWords(selectedVoucherForPrint.amount)}
                    </span>
                  </div>

                  <div style={{ marginBottom: '2.5rem' }}>
                    <div className="payment-mode-pill-box">
                      <span>Mode of payment</span>
                      <strong style={{ fontSize: '1.05rem' }}>{selectedVoucherForPrint.payment_type || 'CASH'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', padding: '0 0.5rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
                      Authorised Signature
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
                      Customer Signature
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#222222', marginTop: '1.5rem' }}>
                    Any cancellation is subjects to 10% deduct on at the discretion of the company
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
