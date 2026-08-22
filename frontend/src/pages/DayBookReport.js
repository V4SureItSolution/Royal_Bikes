import React, { useState, useEffect } from 'react';
import { Home, Calendar, MoreVertical, ShoppingBag } from 'lucide-react';
import { reportService } from '../services/reportService';

export const DayBookReport = () => {
  const [organization, setOrganization] = useState('ROYAL BIKES');
  const [fromDate, setFromDate] = useState('12-08-2026');
  const [toDate, setToDate] = useState('12-08-2026');

  const [reportData, setReportData] = useState({
    opening_balance: 769739.00,
    closing_balance: 767998.00,
    receipts: [
      { date: '12-Aug-2026', receipt_no: '04698', particulars: 'KEERTHANA', acct_no: '2917', amount: 4000.0 }
    ],
    receipts_total: 4000.0,
    vouchers: [
      { date: '12-Aug-2026', voucher_no: '04889', particulars: 'VP GI BOOMIKA', acct_no: '2852', amount: 5741.0 }
    ],
    vouchers_total: 5741.0,
    accounts_breakdown: [
      { acct_no: '2111', amount: 5000.0 },
      { acct_no: '1539', amount: 1000.0 },
      { acct_no: '1731', amount: 1000.0 },
      { acct_no: '1823', amount: -90477.0 },
      { acct_no: '1884', amount: 5000.0 },
      { acct_no: '2104', amount: 10000.0 },
      { acct_no: '2568', amount: 10000.0 }
    ]
  });

  const loadDayBook = async () => {
    try {
      const res = await reportService.getDayBookReport({ from_date: fromDate, to_date: toDate });
      if (res.success && res.opening_balance !== undefined) {
        setReportData(res);
      }
    } catch (err) {
      console.warn('Using local day book report dataset:', err);
    }
  };

  useEffect(() => {
    loadDayBook();
  }, []);

  const formatCurrency = (val) => {
    const isNegative = val < 0;
    const absVal = Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${isNegative ? '-' : ''}₹${absVal}`;
  };

  return (
    <div>
      {/* Title & Breadcrumb Trail Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Day Book Report
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
            <Home size={13} color="#94a3b8" />
            <span>•</span>
            <span>Reports</span>
            <span>•</span>
            <span>MIS Reports</span>
            <span>•</span>
            <span style={{ fontWeight: 600, color: '#475569' }}>Day Book Report</span>
          </div>
        </div>

        <button type="button" className="btn-icon-circle" title="More Options">
          <MoreVertical size={20} color="#64748b" />
        </button>
      </div>

      {/* Top Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {/* Select Organization */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <fieldset className="outlined-fieldset">
            <legend className="outlined-legend">Select Organization</legend>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="outlined-select"
            >
              <option value="ROYAL BIKES">ROYAL BIKES</option>
            </select>
          </fieldset>
        </div>

        {/* From Date */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <legend className="outlined-legend">From Date</legend>
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="outlined-input"
            />
            <Calendar size={18} color="#64748b" />
          </fieldset>
          <div className="field-subtext">Click on the input or the datepicker icon</div>
        </div>

        {/* To Date */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <fieldset className="outlined-fieldset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <legend className="outlined-legend">To Date</legend>
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="outlined-input"
            />
            <Calendar size={18} color="#64748b" />
          </fieldset>
          <div className="field-subtext">Click on the input or the datepicker icon</div>
        </div>

        {/* Submit Button */}
        <div style={{ paddingTop: '0.2rem' }}>
          <button type="button" onClick={loadDayBook} className="btn-save-pill" style={{ padding: '0.65rem 2rem' }}>
            Submit
          </button>
        </div>
      </div>

      {/* Opening Balance Heading (Purple) */}
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#a855f7', marginBottom: '1.75rem' }}>
        Opening Balance <span style={{ color: '#6366f1' }}>{formatCurrency(reportData.opening_balance)}</span>
      </div>

      {/* SECTION 1: RECEIPTS */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#6366f1', marginBottom: '0.85rem' }}>
          Receipt
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#6366f1', fontWeight: 600 }}>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '20%' }}>Date</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '15%' }}>Receipt No</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '35%' }}>Particulars</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '15%' }}>Acct.no</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', width: '15%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.receipts.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.date}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.receipt_no}</td>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{row.particulars}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.acct_no}</td>
                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                  {formatCurrency(row.amount)}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr style={{ borderTop: '1px solid #cbd5e1', borderBottom: '1.5px solid #cbd5e1', fontWeight: 800 }}>
              <td colSpan={4} style={{ padding: '0.75rem 0.5rem', color: '#0f172a' }}>Total</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#0f172a' }}>
                {formatCurrency(reportData.receipts_total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 2: VOUCHERS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#6366f1', marginBottom: '0.85rem' }}>
          Voucher
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#6366f1', fontWeight: 600 }}>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '20%' }}>Date</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '15%' }}>Voucher No</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '35%' }}>Particulars</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '15%' }}>Acct.no</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', width: '15%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.vouchers.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.date}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.voucher_no}</td>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{row.particulars}</td>
                <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.acct_no}</td>
                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                  {formatCurrency(row.amount)}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr style={{ borderTop: '1px solid #cbd5e1', borderBottom: '1.5px solid #cbd5e1', fontWeight: 800 }}>
              <td colSpan={4} style={{ padding: '0.75rem 0.5rem', color: '#0f172a' }}>Total</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#0f172a' }}>
                {formatCurrency(reportData.vouchers_total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Closing Balance Heading (Green) */}
      <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#a855f7', marginBottom: '1.75rem' }}>
        Closing Balance <span style={{ color: '#22c55e' }}>{formatCurrency(reportData.closing_balance)}</span>
      </div>

      {/* Accounts Breakdown Table */}
      <div style={{ maxWidth: '650px', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#6366f1', fontWeight: 600 }}>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', width: '50%' }}>Acct.no</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', width: '50%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.accounts_breakdown.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#334155' }}>{row.acct_no}</td>
                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: row.amount < 0 ? '#ef4444' : '#0f172a' }}>
                  {formatCurrency(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};
