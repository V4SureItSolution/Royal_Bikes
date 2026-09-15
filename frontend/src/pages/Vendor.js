import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Save,
  Plus,
  Bell,
  Bookmark,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { vendorService } from '../services/vendorService';

export const Vendor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isViewRoute = location.pathname.endsWith('/view');
  const [activeTab, setActiveTab] = useState(isViewRoute ? 'view' : 'entry');

  useEffect(() => {
    setActiveTab(location.pathname.endsWith('/view') ? 'view' : 'entry');
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const basePath = location.pathname.startsWith('/pages/vendor') ? '/pages/vendor' : '/vendor';
    navigate(tab === 'view' ? `${basePath}/view` : `${basePath}/entry`);
  };

  // Vendors list state
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Editing vendor ID
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    vendor_code: '',
    display_name: '',
    contact_no: '',
    email: '',
    gst: '',
    gst_doc: '',
    irdai: '',
    irdai_doc: '',
    status: 'Active',
    // Address Details
    billing_address: '',
    shipping_address: '',
    sameAsBilling: true,
    // Bank Details
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch: '',
    account_holder: '',
    // Others Details
    payment_terms: '',
    website: '',
    facebook: '',
    twitter: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Accordion sections for Address & Bank
  const [showAddressSection, setShowAddressSection] = useState(false);
  const [showBankSection, setShowBankSection] = useState(false);

  // Search & Filter for View tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await vendorService.getVendors();
      if (res.success && Array.isArray(res.data)) {
        setVendors(res.data);
      }
    } catch (err) {
      console.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'billing_address' && prev.sameAsBilling) {
        updated.shipping_address = value;
      }
      return updated;
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file.name
      }));
    }
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowAddressSection(false);
    setShowBankSection(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddNewClick = () => {
    handleResetForm();
    if (activeTab !== 'entry') {
      handleTabChange('entry');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.display_name.trim()) {
      setErrorMessage('Vendor Display Name is required.');
      return;
    }
    if (!formData.contact_no.trim()) {
      setErrorMessage('ContactNo is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        shipping_address: formData.sameAsBilling ? formData.billing_address : formData.shipping_address
      };

      if (editingId) {
        const res = await vendorService.updateVendor(editingId, payload);
        if (res.success) {
          setSuccessMessage('Vendor updated successfully!');
          fetchVendors();
          setTimeout(() => {
            handleTabChange('view');
          }, 1000);
        } else {
          setErrorMessage(res.message || 'Failed to update vendor');
        }
      } else {
        const res = await vendorService.createVendor(payload);
        if (res.success) {
          setSuccessMessage('Vendor created successfully!');
          fetchVendors();
          setTimeout(() => {
            handleTabChange('view');
          }, 1000);
        } else {
          setErrorMessage(res.message || 'Failed to create vendor');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while saving vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor.id);
    setFormData({
      vendor_code: vendor.vendor_code || '',
      display_name: vendor.display_name || '',
      contact_no: vendor.contact_no || '',
      email: vendor.email || '',
      gst: vendor.gst || '',
      gst_doc: vendor.gst_doc || '',
      irdai: vendor.irdai || '',
      irdai_doc: vendor.irdai_doc || '',
      status: vendor.status || 'Active',
      billing_address: vendor.billing_address || '',
      shipping_address: vendor.shipping_address || '',
      sameAsBilling: !vendor.shipping_address || vendor.shipping_address === vendor.billing_address,
      bank_name: vendor.bank_name || '',
      account_number: vendor.account_number || '',
      ifsc_code: vendor.ifsc_code || '',
      branch: vendor.branch || '',
      account_holder: vendor.account_holder || '',
      payment_terms: vendor.payment_terms || '',
      website: vendor.website || '',
      facebook: vendor.facebook || '',
      twitter: vendor.twitter || ''
    });
    setShowAddressSection(!!vendor.billing_address || !!vendor.shipping_address);
    setShowBankSection(!!vendor.bank_name || !!vendor.account_number);
    handleTabChange('entry');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setLoading(true);
      try {
        await vendorService.deleteVendor(id);
        setSuccessMessage('Vendor removed successfully');
        fetchVendors();
      } catch (err) {
        setErrorMessage('Failed to delete vendor');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtered vendors for View tab
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      (v.display_name && v.display_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.vendor_code && v.vendor_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.contact_no && v.contact_no.includes(searchQuery)) ||
      (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.gst && v.gst.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage) || 1;
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="vendor-page-wrapper" style={{ padding: '1.25rem 2rem 3rem', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Bar: Add New button + Tabs + Icons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            className="vendor-btn-add-new"
            onClick={handleAddNewClick}
            style={{
              background: '#5046e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '0.45rem 1.25rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(80, 70, 229, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} /> Add New
          </button>

          {/* Quick tab switcher if desired */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '2px' }}>
            <button
              type="button"
              onClick={() => handleTabChange('entry')}
              style={{
                padding: '0.35rem 1rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'entry' ? '#ffffff' : 'transparent',
                color: activeTab === 'entry' ? '#1e293b' : '#64748b',
                boxShadow: activeTab === 'entry' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Entry
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('view')}
              style={{
                padding: '0.35rem 1rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'view' ? '#ffffff' : 'transparent',
                color: activeTab === 'view' ? '#1e293b' : '#64748b',
                boxShadow: activeTab === 'view' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              View ({vendors.length})
            </button>
          </div>
        </div>

        {/* Top Header Right: Notification and Bookmark Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            title="Notifications"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6366f1',
              padding: '0.4rem',
              borderRadius: '50%'
            }}
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            title="Bookmark"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6366f1',
              padding: '0.4rem',
              borderRadius: '50%'
            }}
          >
            <Bookmark size={18} />
          </button>
        </div>
      </div>

      {/* Breadcrumb & Action Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.85rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {activeTab === 'entry' ? (editingId ? 'Edit-Vendor' : 'Add-Vendor') : 'View-Vendors'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
            <Home size={15} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
            <span>•</span>
            <span>Master</span>
            <span>•</span>
            <span>Vendor</span>
            <span>•</span>
            <span style={{ color: '#0f172a', fontWeight: 500 }}>
              {activeTab === 'entry' ? (editingId ? 'Edit-Vendor' : 'Add-Vendor') : 'Vendor-List'}
            </span>
          </div>
        </div>

        {/* Save button (on Entry tab) */}
        {activeTab === 'entry' && (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            style={{
              background: '#5046e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '0.45rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(80, 70, 229, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Save size={16} /> Save
          </button>
        )}
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}
        >
          <CheckCircle2 size={18} color="#059669" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}
        >
          <AlertCircle size={18} color="#dc2626" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ENTRY TAB: 2-COLUMN FORM MATCHING SCREENSHOT */}
      {activeTab === 'entry' ? (
        <form onSubmit={handleSave}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '3rem',
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Left Column: Vendor Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Vendor Details
              </h3>

              {/* Vendor Code */}
              <div>
                <input
                  type="text"
                  name="vendor_code"
                  placeholder="Vendor Code"
                  value={formData.vendor_code}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Vendor Display Name* */}
              <div>
                <input
                  type="text"
                  name="display_name"
                  placeholder="Vendor Display Name*"
                  required
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* ContactNo* */}
              <div>
                <input
                  type="text"
                  name="contact_no"
                  placeholder="ContactNo*"
                  required
                  value={formData.contact_no}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* E-Mail */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* GST */}
              <div>
                <input
                  type="text"
                  name="gst"
                  placeholder="GST"
                  value={formData.gst}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* GST File Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    background: '#e2e8f0',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <UploadCloud size={14} /> Choose File
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'gst_doc')}
                  />
                </label>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {formData.gst_doc || 'No file chosen'}
                </span>
              </div>

              {/* IRDAI */}
              <div>
                <input
                  type="text"
                  name="irdai"
                  placeholder="IRDAI"
                  value={formData.irdai}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* IRDAI File Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    background: '#e2e8f0',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <UploadCloud size={14} /> Choose File
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'irdai_doc')}
                  />
                </label>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {formData.irdai_doc || 'No file chosen'}
                </span>
              </div>

              {/* Select Status* */}
              <div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Add Billing & shipping Address Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAddressSection((prev) => !prev)}
                  style={{
                    width: '100%',
                    background: '#5046e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 4px rgba(80, 70, 229, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MapPin size={16} /> Add Billing & shipping Address{' '}
                  {showAddressSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Address Details Container */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '1rem',
                  background: '#f8fafc'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginBottom: showAddressSection ? '0.75rem' : '0'
                  }}
                  onClick={() => setShowAddressSection((prev) => !prev)}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                    Address Details
                  </span>
                  {showAddressSection ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
                </div>

                {showAddressSection && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                        Billing Address
                      </label>
                      <textarea
                        name="billing_address"
                        rows="2"
                        placeholder="Enter Billing Address..."
                        value={formData.billing_address}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.85rem',
                          color: '#1e293b'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id="sameAsBilling"
                        name="sameAsBilling"
                        checked={formData.sameAsBilling}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="sameAsBilling" style={{ fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
                        Shipping Address same as Billing Address
                      </label>
                    </div>

                    {!formData.sameAsBilling && (
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                          Shipping Address
                        </label>
                        <textarea
                          name="shipping_address"
                          rows="2"
                          placeholder="Enter Shipping Address..."
                          value={formData.shipping_address}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '0.85rem',
                            color: '#1e293b'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Bank Details Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowBankSection((prev) => !prev)}
                  style={{
                    width: '100%',
                    background: '#5046e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 4px rgba(80, 70, 229, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Building size={16} /> Add Bank Details{' '}
                  {showBankSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Bank Details Container */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '1rem',
                  background: '#f8fafc'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginBottom: showBankSection ? '0.75rem' : '0'
                  }}
                  onClick={() => setShowBankSection((prev) => !prev)}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                    Bank Details
                  </span>
                  {showBankSection ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
                </div>

                {showBankSection && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <div>
                      <input
                        type="text"
                        name="bank_name"
                        placeholder="Bank Name"
                        value={formData.bank_name}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="account_number"
                        placeholder="Account Number"
                        value={formData.account_number}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="ifsc_code"
                        placeholder="IFSC Code"
                        value={formData.ifsc_code}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="branch"
                        placeholder="Branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <input
                        type="text"
                        name="account_holder"
                        placeholder="Account Holder Name"
                        value={formData.account_holder}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Others Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Others Details
              </h3>

              {/* Payment Terms* */}
              <div>
                <input
                  type="text"
                  name="payment_terms"
                  placeholder="Payment Terms*"
                  value={formData.payment_terms}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Website */}
              <div>
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* FaceBook */}
              <div>
                <input
                  type="text"
                  name="facebook"
                  placeholder="FaceBook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Twitter */}
              <div>
                <input
                  type="text"
                  name="twitter"
                  placeholder="Twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="karoda-vendor-input"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* VIEW TAB: VENDOR LIST TABLE */
        <div
          style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          {/* Table Filters Header */}
          <div
            style={{
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.45rem 0.75rem',
                  flex: 1
                }}
              >
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search by name, code, contact, GST..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '100%'
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  background: '#f8fafc'
                }}
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing <b>{paginatedVendors.length}</b> of <b>{filteredVendors.length}</b> vendors
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Display Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contact No</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>GST</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Payment Terms</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No vendors found. Click "+ Add New" to create one.
                    </td>
                  </tr>
                ) : (
                  paginatedVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155' }}>
                        {vendor.vendor_code || `VEND-${vendor.id}`}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                        {vendor.display_name}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {vendor.contact_no}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                        {vendor.email || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {vendor.gst || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {vendor.payment_terms || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: vendor.status === 'Active' ? '#dcfce7' : '#fee2e2',
                            color: vendor.status === 'Active' ? '#166534' : '#991b1b'
                          }}
                        >
                          {vendor.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(vendor)}
                            title="Edit Vendor"
                            style={{
                              border: 'none',
                              background: '#ede9fe',
                              color: '#6366f1',
                              padding: '0.35rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(vendor.id)}
                            title="Delete Vendor"
                            style={{
                              border: 'none',
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '0.35rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div
              style={{
                padding: '0.85rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                color: '#64748b'
              }}
            >
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '0.3rem 0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '0.3rem 0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer (as seen in Image 4) */}
      <div
        style={{
          marginTop: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          fontSize: '0.82rem',
          color: '#64748b'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#5046e5',
            color: '#ffffff',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600
          }}
        >
          <ShieldCheck size={14} /> GST Billing Software
        </div>
        <span>Copyright ©2026 All rights reserved</span>
      </div>
    </div>
  );
};
