import React, { useState, useRef } from 'react';
import { Home, Calendar, ShoppingBag } from 'lucide-react';
import { reportService } from '../services/reportService';
import { getTodayDateStr } from '../utils/dateUtils';

export const DayBookReport = () => {
  const [organization, setOrganization] = useState('ROYAL BIKES');
  const [fromDate, setFromDate] = useState(getTodayDateStr);
  const [toDate, setToDate] = useState(getTodayDateStr);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const formatCurrency = (val) => {
    const isNegative = val < 0;
    const absVal = Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${isNegative ? '-' : ''}₹${absVal}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    try {
      const res = await reportService.getDayBookReport({ from_date: fromDate, to_date: toDate });
      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      console.warn('Day book report fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = (ref) => {
    if (ref.current) {
      if (typeof ref.current.showPicker === 'function') ref.current.showPicker();
      else { ref.current.focus(); ref.current.click(); }
    }
  };

  // Auto-calculated closing balance = Opening + Receipts - Vouchers - RTN
  const closingBalance = reportData
    ? reportData.opening_balance + reportData.receipts_total - reportData.vouchers_total - (reportData.rtn_total || 0)
    : 0;

  return (
    <div>
      {/* Title & Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Day Book Report
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
          <Home size={13} color="#94a3b8" />
          <span>•</span><span>Reports</span>
          <span>•</span><span>MIS Reports</span>
          <span>•</span><span style={{ fontWeight: 600, color: '#475569' }}>Day Book Report</span>
        </div>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>

          {/* Organization */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <fieldset className="outlined-fieldset">
              <legend className="outlined-legend">Select Organization</legend>
              <select value={organization} onChange={(e) => setOrganization(e.target.value)} className="outlined-select">
                <option value="ROYAL BIKES">ROYAL BIKES</option>
              </select>
            </fieldset>
          </div>

          {/* From Date */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <fieldset
              className="outlined-fieldset"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => openDatePicker(fromDateRef)}
            >
              <legend className="outlined-legend">From Date</legend>
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="outlined-input"
                placeholder="DD-MM-YYYY"
                style={{ cursor: 'pointer' }}
              />
              <Calendar size={18} color="#64748b" />
              <input
                type="date"
                ref={fromDateRef}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m, d] = e.target.value.split('-');
                    setFromDate(`${d}-${m}-${y}`);
                  }
                }}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
              />
            </fieldset>
          </div>

          {/* To Date */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <fieldset
              className="outlined-fieldset"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => openDatePicker(toDateRef)}
            >
              <legend className="outlined-legend">To Date</legend>
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="outlined-input"
                placeholder="DD-MM-YYYY"
                style={{ cursor: 'pointer' }}
              />
              <Calendar size={18} color="#64748b" />
              <input
                type="date"
                ref={toDateRef}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m, d] = e.target.value.split('-');
                    setToDate(`${d}-${m}-${y}`);
                  }
                }}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
              />
            </fieldset>
          </div>

          {/* Submit */}
          <div>
            <button type="submit" className="btn-save-pill" style={{ padding: '0.65rem 2rem' }}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>

      {/* Not yet submitted */}
      {!submitted && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontSize: '0.95rem' }}>
          Select organization and date range, then click <strong>Submit</strong> to view the Day Book.
        </div>
      )}

      {/* Loading */}
      {submitted && loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6366f1', fontSize: '0.95rem' }}>
          Loading Day Book...
        </div>
      )}

      {/* Report Output */}
      {submitted && !loading && reportData && (
        <>
          {/* Opening Balance */}
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#a855f7', marginBottom: '1.75rem' }}>
            Opening Balance&nbsp;
            <span style={{ color: '#6366f1' }}>{formatCurrency(reportData.opening_balance)}</span>
          </div>

          {/* RECEIPT Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Receipt <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>(Money Incoming ⬆️)</span>
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
                {reportData.receipts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '1.5rem 0.5rem', color: '#94a3b8', textAlign: 'center' }}>No receipts for this period</td>
                  </tr>
                ) : (
                  reportData.receipts.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.date}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.receipt_no}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{row.particulars}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.acct_no}</td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#22c55e' }}>
                        {formatCurrency(row.amount)}
                      </td>
                    </tr>
                  ))
                )}
                <tr style={{ borderTop: '1.5px solid #cbd5e1', fontWeight: 800, backgroundColor: '#f0fdf4' }}>
                  <td colSpan={4} style={{ padding: '0.75rem 0.5rem', color: '#0f172a' }}>Total</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#22c55e' }}>
                    {formatCurrency(reportData.receipts_total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* VOUCHER Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Voucher <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>(Money Outgoing ⬇️)</span>
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
                {reportData.vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '1.5rem 0.5rem', color: '#94a3b8', textAlign: 'center' }}>No vouchers for this period</td>
                  </tr>
                ) : (
                  reportData.vouchers.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.date}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.voucher_no}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{row.particulars}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.acct_no}</td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>
                        {formatCurrency(row.amount)}
                      </td>
                    </tr>
                  ))
                )}
                <tr style={{ borderTop: '1.5px solid #cbd5e1', fontWeight: 800, backgroundColor: '#fef2f2' }}>
                  <td colSpan={4} style={{ padding: '0.75rem 0.5rem', color: '#0f172a' }}>Total</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#ef4444' }}>
                    {formatCurrency(reportData.vouchers_total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RTN PAYMENT Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f97316', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              RTN Payment <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>(Refund / Return ↩️)</span>
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
                {(reportData.rtn_payments || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '1.5rem 0.5rem', color: '#94a3b8', textAlign: 'center' }}>No RTN payments for this period</td>
                  </tr>
                ) : (
                  (reportData.rtn_payments || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.date}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.voucher_no}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{row.particulars}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>{row.acct_no}</td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#f97316' }}>
                        {formatCurrency(row.amount)}
                      </td>
                    </tr>
                  ))
                )}
                <tr style={{ borderTop: '1.5px solid #cbd5e1', fontWeight: 800, backgroundColor: '#fff7ed' }}>
                  <td colSpan={4} style={{ padding: '0.75rem 0.5rem', color: '#0f172a' }}>Total</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#f97316' }}>
                    {formatCurrency(reportData.rtn_total || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Closing Balance Calculation Box */}
          <div style={{
            backgroundColor: '#faf5ff',
            border: '1.5px solid #d8b4fe',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            maxWidth: '480px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
              <span>Opening Balance</span>
              <span style={{ fontWeight: 600, color: '#7c3aed' }}>+ {formatCurrency(reportData.opening_balance)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
              <span>(+) Total Receipt</span>
              <span style={{ fontWeight: 600, color: '#22c55e' }}>+ {formatCurrency(reportData.receipts_total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
              <span>(−) Total Voucher</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>− {formatCurrency(reportData.vouchers_total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.95rem', color: '#475569' }}>
              <span>(−) Total RTN Payment</span>
              <span style={{ fontWeight: 600, color: '#f97316' }}>− {formatCurrency(reportData.rtn_total || 0)}</span>
            </div>
            <div style={{ borderTop: '1.5px solid #d8b4fe', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a855f7' }}>Closing Balance</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: closingBalance >= 0 ? '#22c55e' : '#ef4444' }}>
                {formatCurrency(closingBalance)}
              </span>
            </div>
          </div>

          {/* Account-wise Breakdown */}
          {reportData.accounts_breakdown.length > 0 && (
            <div style={{ maxWidth: '500px', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.75rem' }}>
                Account-wise Breakdown
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#6366f1', fontWeight: 600 }}>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Acct.no</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Amount</th>
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
          )}
        </>
      )}

      {/* No data after submit */}
      {submitted && !loading && reportData && reportData.receipts.length === 0 && reportData.vouchers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          No transactions found for the selected date range.
        </div>
      )}

      {/* Footer */}
      <div className="page-footer-banner" style={{ marginTop: '2rem' }}>
        <div className="badge-gst-software">
          <ShoppingBag size={16} />
          <span>GST Billing Software</span>
        </div>
        <div className="footer-copyright-text">Copyright ©2026 All rights reserved</div>
      </div>
    </div>
  );
};
