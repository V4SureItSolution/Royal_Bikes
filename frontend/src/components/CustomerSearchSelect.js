import React, { useState, useEffect } from 'react';
import { CheckCircle2, User, Phone, Mail, MapPin, Target, Building, X, Plus } from 'lucide-react';
import { customerService } from '../services/customerService';

export const CustomerSearchSelect = ({ 
  selectedCustomerName, 
  onSelectCustomer, 
  customerList: propCustomerList, 
  setCustomerList: propSetCustomerList 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internalList, setInternalList] = useState(() => customerService.getStoredCustomers());
  const [searchQuery, setSearchQuery] = useState('');

  const activeCustomerList = propCustomerList && propCustomerList.length > 0 ? propCustomerList : internalList;

  const loadCustomers = async () => {
    const list = await customerService.getAllCustomers();
    setInternalList(list);
    if (propSetCustomerList) {
      propSetCustomerList(list);
    }
  };

  useEffect(() => {
    loadCustomers();

    const handleUpdate = () => loadCustomers();
    window.addEventListener('customerUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('customerUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [form, setForm] = useState({
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

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.phone) {
      alert('First Name and Phone Number are required!');
      return;
    }

    const res = await customerService.createCustomer(form);
    const newCust = res?.data || {
      id: Date.now(),
      name: `${form.firstName} ${form.lastName}`.trim().toUpperCase(),
      city: form.townCity || form.streetArea || 'CHENNAI',
      mob: form.phone
    };

    if (propSetCustomerList) {
      propSetCustomerList((prev) => [newCust, ...prev.filter(c => c.name !== newCust.name)]);
    }
    setInternalList((prev) => [newCust, ...prev.filter(c => c.name !== newCust.name)]);

    onSelectCustomer(newCust);
    setIsModalOpen(false);
    setForm({
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


  return (
    <div style={{ position: 'relative' }}>
      <fieldset 
        className="outlined-fieldset" 
        style={{ cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <legend className="outlined-legend">Customer Name</legend>
        <input
          type="text"
          value={selectedCustomerName}
          placeholder=""
          readOnly
          className="outlined-input"
          style={{ cursor: 'pointer' }}
        />
      </fieldset>

      {/* Dropdown Options */}
      {isOpen && (
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
              setIsOpen(false);
              setIsModalOpen(true);
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
          {activeCustomerList.map((cust) => (
            <div
              key={cust.id || cust.name}
              onClick={() => {
                onSelectCustomer(cust);
                setIsOpen(false);
              }}
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

      {/* New Customer Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="printable-receipt-card" style={{ maxWidth: '520px', borderRadius: '12px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header" style={{ borderBottom: 'none', padding: '1.25rem 1.5rem 0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                New Customer
              </h3>
              <button
                type="button"
                className="btn-icon-circle"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                
                {/* First & Last Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <legend className="outlined-legend">First Name*</legend>
                    <User size={16} color="#64748b" />
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="outlined-input"
                    />
                  </fieldset>

                  <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <legend className="outlined-legend">Last Name</legend>
                    <User size={16} color="#64748b" />
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="outlined-input"
                    />
                  </fieldset>
                </div>

                {/* Phone */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Phone Number*</legend>
                  <Phone size={16} color="#64748b" />
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Email */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Email</legend>
                  <Mail size={16} color="#64748b" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Flat, HouseNo */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Flat,HouseNo</legend>
                  <input
                    type="text"
                    value={form.flatHouseNo}
                    onChange={(e) => setForm({ ...form, flatHouseNo: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Street, Area, Sector, Village */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Street,Area,Sector,Village</legend>
                  <MapPin size={16} color="#64748b" />
                  <input
                    type="text"
                    value={form.streetArea}
                    onChange={(e) => setForm({ ...form, streetArea: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Landmark */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Landmark</legend>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Pincode * */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Pincode *</legend>
                  <Target size={16} color="#64748b" />
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Town,City */}
                <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <legend className="outlined-legend">Town,City</legend>
                  <Building size={16} color="#64748b" />
                  <input
                    type="text"
                    value={form.townCity}
                    onChange={(e) => setForm({ ...form, townCity: e.target.value })}
                    className="outlined-input"
                  />
                </fieldset>

                {/* Select State / Province / Region * */}
                <fieldset className="outlined-fieldset">
                  <legend className="outlined-legend">Select State / Province / Region*</legend>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
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

                {/* Modal Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.25rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};
