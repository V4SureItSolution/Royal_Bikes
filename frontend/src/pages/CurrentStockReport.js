import React, { useState, useEffect } from 'react';
import { Calendar, Search, FileText, ShoppingBag } from 'lucide-react';
import { reportService } from '../services/reportService';

export const CurrentStockReport = () => {
  const [asOnDate, setAsOnDate] = useState('12-08-2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState({});

  const loadStockReport = async () => {
    try {
      const res = await reportService.getCurrentStockReport({ as_on_date: asOnDate, search: searchQuery });
      if (res.success && res.data) setStockData(res.data);
    } catch (err) {
      console.warn('Failed to load stock report:', err);
    }
  };

  useEffect(() => {
    loadStockReport();

    const handleUpdate = () => loadStockReport();
    window.addEventListener('directStockUpdated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('directStockUpdated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [asOnDate, searchQuery]);

  return (
    <div>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div className="page-title-icon">
          <FileText size={22} />
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Current Stock Report
        </h2>
      </div>

      {/* Top Filter & Search Control Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {/* As On Date Field */}
        <div style={{ width: '240px' }}>
          <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <legend className="outlined-legend">As On Date</legend>
            <input
              type="text"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              className="outlined-input"
            />
            <Calendar size={18} color="#64748b" />
          </fieldset>
        </div>

        {/* PDF Export Button */}
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: '#475569'
          }}
        >
          <div style={{ backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '1px 4px', borderRadius: '3px' }}>
            PDF
          </div>
        </button>

        {/* Search Input Box */}
        <div style={{ flex: 1, maxWidth: '420px', minWidth: '260px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '0.6rem 0.85rem'
          }}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Type here to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#0f172a' }}
            />
          </div>
        </div>
      </div>

      {/* Brand Stock Tables */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {Object.keys(stockData).length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.95rem' }}>
            No stock entries found. Add products via Direct Stock.
          </div>
        )}

        {Object.entries(stockData).map(([brand, items]) => {
          const filteredItems = items.filter((item) =>
            !searchQuery ||
            item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.engine_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.chassis_number.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          // Total stock = sum of all entries under this brand
          const totalStock = filteredItems.length;

          return (
            <div key={brand}>
              {/* Brand Title + Total Stock Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6366f1', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {brand}
                </h3>
                <span style={{
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  border: '1px solid #c7d2fe'
                }}>
                  Total Stock: {totalStock}
                </span>
              </div>

              {/* Table */}
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#000099', color: '#ffffff' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '5%' }}>#</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '28%' }}>Model</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '15%' }}>Color</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '25%' }}>Engine Number</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '27%' }}>Chassis Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: idx === filteredItems.length - 1 ? 'none' : '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}
                      >
                        <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>
                          {row.model}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.88rem' }}>
                          {row.color}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155', fontSize: '0.88rem', fontFamily: 'monospace' }}>
                          {row.engine_number}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155', fontSize: '0.88rem', fontFamily: 'monospace' }}>
                          {row.chassis_number}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Brand Total Footer Row */}
                  <tfoot>
                    <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                      <td colSpan={4} style={{ padding: '0.6rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                        Total {brand} Stock
                      </td>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 800, color: '#3730a3', fontSize: '0.9rem' }}>
                        {totalStock} unit{totalStock !== 1 ? 's' : ''}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Bottom Footer Banner */}
      <div className="page-footer-banner" style={{ marginTop: '2.5rem' }}>
        <div className="badge-gst-software">
          <ShoppingBag size={16} />
          <span>GST Billing Software</span>
        </div>
        <div className="footer-copyright-text">
          Copyright ©2026 All rights reserved
        </div>
      </div>
    </div>
  );
};
