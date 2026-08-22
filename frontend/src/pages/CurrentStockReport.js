import React, { useState, useEffect } from 'react';
import { Calendar, Search, FileText, ShoppingBag } from 'lucide-react';
import { reportService } from '../services/reportService';

export const CurrentStockReport = () => {
  const [asOnDate, setAsOnDate] = useState('12-08-2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState({
    HONDA: [
      { model: 'HONDA DIO STD', color: 'GREY', engine_number: 'JF98EW6054650', chassis_number: 'ME4JF98JERW045058' },
      { model: 'HONDA ACTIVA DLX', color: 'PS BLUE', engine_number: 'JK15EG7082683', chassis_number: 'ME4JK158KRG082526' },
      { model: 'HONDA ACTIVA STD', color: 'PS BLUE', engine_number: 'JK36EG1276140', chassis_number: 'ME4JK361ATG275882' },
      { model: 'HONDA DIO STD', color: 'BLACK', engine_number: 'JK42EG0056772', chassis_number: 'ME4JK420MSG028147' },
      { model: 'HONDA ACTIVA STD', color: 'BLUE', engine_number: 'RD-JK36EG1268793', chassis_number: 'RD-ME4JK361ATG268564' },
      { model: 'HONDA DIO STD', color: 'GREY', engine_number: 'JK42EG0100642', chassis_number: 'ME4JK422ETG048872' },
      { model: 'HONDA DIO STD', color: 'RED', engine_number: 'JK42EG0105398', chassis_number: 'ME4JK420FTG054278' },
      { model: 'HONDA DIO 125 STD', color: 'G.GREY', engine_number: 'JK44EW0163428', chassis_number: 'ME4JK442FTW053405' },
      { model: 'HONDA ACTIVA STD', color: 'RED', engine_number: 'JK36EW4086491', chassis_number: 'ME4JK364FTW086406' },
      { model: 'HONDA SP125 DISC', color: 'B/RED', engine_number: 'JC94EG4414551', chassis_number: 'ME4JC94EGTG762974' }
    ],
    HERO: [
      { model: 'HERO SPLENDOR PLUS', color: 'BLACK', engine_number: 'HA10ER789123', chassis_number: 'ME4HA10ER889100' },
      { model: 'HERO HF DELUXE', color: 'RED', engine_number: 'HA10ER554112', chassis_number: 'ME4HA10ER998122' }
    ],
    'ROYAL ENFIELD': [
      { model: 'ROYAL ENFIELD CLASSIC 350', color: 'STEALTH BLACK', engine_number: 'J350ENG99120', chassis_number: 'ME4J350CHS11200' },
      { model: 'ROYAL ENFIELD HUNTER 350', color: 'DAPPER GREY', engine_number: 'J350ENG88712', chassis_number: 'ME4J350CHS22199' }
    ]
  });

  const loadStockReport = async () => {
    try {
      const res = await reportService.getCurrentStockReport({ as_on_date: asOnDate, search: searchQuery });
      if (res.success && res.data) {
        setStockData(res.data);
      }
    } catch (err) {
      console.warn('Using local stock dataset:', err);
    }
  };

  useEffect(() => {
    loadStockReport();
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
        {Object.entries(stockData).map(([brand, items]) => {
          const filteredItems = items.filter((item) => 
            !searchQuery || 
            item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.engine_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.chassis_number.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={brand}>
              {/* Brand Title */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {brand}
              </h3>

              {/* Dark Blue Header Table */}
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#000099', color: '#ffffff' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '30%' }}>Model</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '15%' }}>Color</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '25%' }}>Engine Number</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', width: '30%' }}>Chassis Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((row, idx) => (
                      <tr 
                        key={idx} 
                        style={{ borderBottom: idx === filteredItems.length - 1 ? 'none' : '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}
                      >
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
