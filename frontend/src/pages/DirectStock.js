import React, { useState, useEffect, useRef } from 'react';
import { FileText, Calendar, ChevronDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';

export const DirectStock = () => {
  const [activeTab, setActiveTab] = useState('entry'); // 'entry' | 'view'
  const [productsList, setProductsList] = useState([
    'Royal Enfield Classic 350',
    'Royal Enfield Hunter 350',
    'Royal Enfield Meteor 350',
    'Royal Enfield Bullet 350',
    'Royal Enfield Himalayan 450',
    'Royal Enfield Interceptor 650',
    'Royal Enfield Continental GT 650'
  ]);
  const [vendorsList] = useState([
    'HARDEEP HONDA',
    'ROYAL ENFIELD DISTRIBUTORS',
    'SRI MOTORS',
    'MADRAS MOTORS',
    'RNS MOTORS'
  ]);

  const [stockEntries, setStockEntries] = useState([
    {
      id: 1,
      organization: 'ROYAL BIKES',
      date: '12-08-2026',
      vendor: 'HARDEEP HONDA',
      product: 'Royal Enfield Classic 350',
      quantity: 1,
      engineNumber: 'ENG-350-98214',
      chassisNumber: 'CHS-RE-77120',
      color: 'Stealth Black',
      notes: 'Initial direct stock entry from main distributor.'
    }
  ]);

  const [formData, setFormData] = useState({
    organization: 'ROYAL BIKES',
    date: '12-08-2026',
    vendor: 'HARDEEP HONDA',
    product: '',
    quantity: 1,
    engineNumber: '',
    chassisNumber: '',
    color: '',
    notes: ''
  });

  // Filter Input States (Pending)
  const [inputOrgFilter, setInputOrgFilter] = useState('ALL');
  const [inputFromDate, setInputFromDate] = useState('');
  const [inputToDate, setInputToDate] = useState('');

  // Applied Filter States (Used for table)
  const [appliedOrgFilter, setAppliedOrgFilter] = useState('ALL');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Date Picker Refs
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const fetchedNames = res.data.map((p) => p.name);
          setProductsList((prev) => Array.from(new Set([...fetchedNames, ...prev])));
        }
      } catch (err) {
        console.warn('Using default product list due to API fetch failure:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleClear = () => {
    setFormData({
      organization: 'ROYAL BIKES',
      date: '12-08-2026',
      vendor: 'HARDEEP HONDA',
      product: '',
      quantity: 1,
      engineNumber: '',
      chassisNumber: '',
      color: '',
      notes: ''
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.product || !formData.vendor || !formData.engineNumber || !formData.chassisNumber || !formData.color) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...formData
    };

    setStockEntries([newEntry, ...stockEntries]);
    alert('Direct Stock Entry saved successfully!');
    handleClear();
    setActiveTab('view');
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setAppliedOrgFilter(inputOrgFilter);
    setAppliedFromDate(inputFromDate);
    setAppliedToDate(inputToDate);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setInputOrgFilter('ALL');
    setAppliedOrgFilter('ALL');
    setInputFromDate('');
    setAppliedFromDate('');
    setInputToDate('');
    setAppliedToDate('');
    setCurrentPage(1);
  };

  // Parse helper for dates in DD-MM-YYYY or YYYY-MM-DD format
  const parseEntryDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dateStr);
  };

  // Filter calculation using APPLIED filters
  const filteredEntries = stockEntries.filter((entry) => {
    // 1. Organization filter
    if (appliedOrgFilter !== 'ALL' && entry.organization !== appliedOrgFilter) {
      return false;
    }

    // 2. FromDate filter
    if (appliedFromDate) {
      const entryDate = parseEntryDate(entry.date);
      const fromDateObj = parseEntryDate(appliedFromDate);
      if (entryDate && fromDateObj && entryDate < fromDateObj) {
        return false;
      }
    }

    // 3. ToDate filter
    if (appliedToDate) {
      const entryDate = parseEntryDate(entry.date);
      const toDateObj = parseEntryDate(appliedToDate);
      if (toDateObj) {
        toDateObj.setHours(23, 59, 59, 999);
      }
      if (entryDate && toDateObj && entryDate > toDateObj) {
        return false;
      }
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Title Header */}
      <div className="page-title-header">
        <div className="page-title-icon">
          <FileText size={22} />
        </div>
        <div className="page-title-text">Direct Stock</div>
      </div>

      {/* Tabs Switcher */}
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

      {/* Tab 1: Entry Form */}
      {activeTab === 'entry' && (
        <form onSubmit={handleSave}>
          <div className="form-grid">
            {/* Select Organization */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Select Organization</legend>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <select
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="outlined-select"
                >
                  <option value="ROYAL BIKES">ROYAL BIKES</option>
                  <option value="ROYAL MOTORS">ROYAL MOTORS</option>
                </select>
                <ChevronDown size={16} color="#64748b" style={{ pointerEvents: 'none' }} />
              </div>
            </fieldset>

            {/* Date */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Date</legend>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="outlined-input"
                />
                <Calendar size={18} color="#64748b" />
              </div>
            </fieldset>

            {/* Select Vendor */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Select Vendor *</legend>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <select
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="outlined-select"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendorsList.map((v, idx) => (
                    <option key={idx} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} color="#64748b" style={{ pointerEvents: 'none' }} />
              </div>
            </fieldset>

            {/* Product */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend" style={{ color: '#6366f1' }}>Product *</legend>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <select
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="outlined-select"
                >
                  <option value="">-- Select Product --</option>
                  {productsList.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} color="#64748b" style={{ pointerEvents: 'none' }} />
              </div>
            </fieldset>

            {/* Quantity */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Quantity</legend>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="outlined-input"
                />
                <ChevronDown size={16} color="#64748b" />
              </div>
            </fieldset>

            {/* Engine Number, Chassis Number, Color */}
            <div className="form-grid-full form-grid-3">
              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend" style={{ color: '#6366f1' }}>Engine Number *</legend>
                <input
                  type="text"
                  required
                  value={formData.engineNumber}
                  onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                  className="outlined-input"
                />
              </fieldset>

              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend" style={{ color: '#6366f1' }}>Chassis Number *</legend>
                <input
                  type="text"
                  required
                  value={formData.chassisNumber}
                  onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                  className="outlined-input"
                />
              </fieldset>

              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend" style={{ color: '#6366f1' }}>Color *</legend>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="outlined-input"
                />
              </fieldset>
            </div>

            {/* Notes */}
            <fieldset className="outlined-fieldset form-grid-full">
              <legend className="outlined-legend" style={{ color: '#6366f1' }}>Notes</legend>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="outlined-textarea"
              ></textarea>
            </fieldset>
          </div>

          {/* Action Buttons */}
          <div className="form-actions-row">
            <button type="submit" className="btn-save-pill">
              Save
            </button>
            <button type="button" onClick={handleClear} className="btn-clear-link">
              Clear
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: View Records */}
      {activeTab === 'view' && (
        <div>
          {/* View Bar Filters: Organization, FromDate, ToDate & Submit */}
          <form onSubmit={handleApplyFilters} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {/* Organization Filter */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <fieldset className="outlined-fieldset">
                <legend className="outlined-legend">Select Organization</legend>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <select
                    value={inputOrgFilter}
                    onChange={(e) => setInputOrgFilter(e.target.value)}
                    className="outlined-select"
                  >
                    <option value="ALL">ALL ORGANIZATIONS</option>
                    <option value="ROYAL BIKES">ROYAL BIKES</option>
                    <option value="ROYAL MOTORS">ROYAL MOTORS</option>
                  </select>
                  <ChevronDown size={16} color="#64748b" style={{ pointerEvents: 'none' }} />
                </div>
              </fieldset>
            </div>

            {/* Modern FromDate Filter */}
            <div style={{ flex: 1, minWidth: '185px' }}>
              <fieldset
                className="modern-date-fieldset"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => openDatePicker(fromDateRef)}
              >
                <legend className="outlined-legend">FromDate</legend>
                <input
                  type="text"
                  value={inputFromDate}
                  onChange={(e) => setInputFromDate(e.target.value)}
                  className="outlined-input"
                  style={{ cursor: 'pointer', fontWeight: 500, color: '#1e293b' }}
                  placeholder="DD-MM-YYYY"
                />
                <div className="calendar-icon-badge">
                  <Calendar size={15} />
                </div>
                <input
                  type="date"
                  ref={fromDateRef}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setInputFromDate(`${d}-${m}-${y}`);
                    }
                  }}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                />
              </fieldset>
            </div>

            {/* Modern ToDate Filter */}
            <div style={{ flex: 1, minWidth: '185px' }}>
              <fieldset
                className="modern-date-fieldset"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => openDatePicker(toDateRef)}
              >
                <legend className="outlined-legend">ToDate</legend>
                <input
                  type="text"
                  value={inputToDate}
                  onChange={(e) => setInputToDate(e.target.value)}
                  className="outlined-input"
                  style={{ cursor: 'pointer', fontWeight: 500, color: '#1e293b' }}
                  placeholder="DD-MM-YYYY"
                />
                <div className="calendar-icon-badge">
                  <Calendar size={15} />
                </div>
                <input
                  type="date"
                  ref={toDateRef}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setInputToDate(`${d}-${m}-${y}`);
                    }
                  }}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                />
              </fieldset>
            </div>

            {/* Submit Filter Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="submit"
                className="btn-save-pill"
                style={{ padding: '0.55rem 1.75rem', fontSize: '0.9rem' }}
              >
                Submit
              </button>

              {/* Reset/Clear Button */}
              {(appliedOrgFilter !== 'ALL' || appliedFromDate !== '' || appliedToDate !== '' || inputOrgFilter !== 'ALL' || inputFromDate !== '' || inputToDate !== '') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn-clear-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RotateCcw size={15} /> Clear
                </button>
              )}
            </div>
          </form>

          {/* Table Card */}
          <div className="table-card">
            <div className="table-responsive">
              <table className="karoda-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th>Product & Vehicle Details</th>
                    <th>Qty</th>
                    <th>Color</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        No direct stock records found for the selected date range and filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td><strong>{entry.organization}</strong></td>
                        <td>{entry.date}</td>
                        <td>{entry.vendor}</td>
                        <td>
                          <div style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.95rem' }}>{entry.product}</div>
                          <div style={{ marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              fontSize: '0.75rem',
                              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                              fontWeight: 500,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              border: '1px solid #c7d2fe'
                            }}>
                              <strong style={{ fontWeight: 600, color: '#4338ca' }}>Engine No:</strong> {entry.engineNumber || 'N/A'}
                            </span>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              fontSize: '0.75rem',
                              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                              fontWeight: 500,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1'
                            }}>
                              <strong style={{ fontWeight: 600, color: '#475569' }}>Chassis No:</strong> {entry.chassisNumber || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td>{entry.quantity}</td>
                        <td>{entry.color}</td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{entry.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="table-pagination-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Items per page: <strong>10</strong></span>
              </div>

              <div>
                {filteredEntries.length > 0
                  ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredEntries.length)} of ${filteredEntries.length}`
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
                <span style={{ fontSize: '0.85rem', fontWeight: 500, margin: '0 0.4rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
