import React, { useState } from 'react';
import { FileText, Calendar, ChevronDown, Check, RefreshCw } from 'lucide-react';

export const DirectStock = () => {
  const [activeTab, setActiveTab] = useState('entry'); // 'entry' | 'view'
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
    if (!formData.product || !formData.engineNumber || !formData.chassisNumber || !formData.color) {
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
            <fieldset className="outlined-fieldset form-grid-full">
              <legend className="outlined-legend">Select Vendor</legend>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="outlined-input"
                placeholder="HARDEEP HONDA"
              />
            </fieldset>

            {/* Product */}
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend" style={{ color: '#6366f1' }}>Product</legend>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="outlined-input"
                placeholder="Product Name..."
              />
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
        <div className="table-card">
          <div className="table-responsive">
            <table className="karoda-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Engine No</th>
                  <th>Chassis No</th>
                  <th>Color</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {stockEntries.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No direct stock records found.
                    </td>
                  </tr>
                ) : (
                  stockEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td><strong>{entry.organization}</strong></td>
                      <td>{entry.date}</td>
                      <td>{entry.vendor}</td>
                      <td style={{ color: '#6366f1', fontWeight: 600 }}>{entry.product}</td>
                      <td>{entry.quantity}</td>
                      <td><code>{entry.engineNumber}</code></td>
                      <td><code>{entry.chassisNumber}</code></td>
                      <td>{entry.color}</td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{entry.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
