import React, { useState, useEffect } from 'react';
import { Mail, Phone, CheckCircle2, MoreVertical, Home, RefreshCw } from 'lucide-react';
import { reportService } from '../services/reportService';

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stock_on_hand: 47,
    today_sales: '-',
    today_purchase: '-',
    today_expense: '-',
    company_info: {
      name: 'ROYAL BIKES',
      address: '104/1, ERUKKANCHERY HIGH ROADSHARMA NAGAR, VYASARPADI,CHENNAI - 600039',
      email: 'royalbikes2020@gmail.com',
      phone: '04443537237 / 8925270575',
      version: 'Publish version 2.3.3'
    }
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await reportService.getAnalytics();
      if (res && res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Using default analytics cache:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-page-container">
      {/* Top Header / Breadcrumb Bar */}
      <div className="analytics-header-bar">
        <div className="analytics-header-left">
          <span className="analytics-header-title">Dashboard</span>
          <div className="analytics-breadcrumb">
            <Home size={14} className="analytics-home-icon" />
            <span className="breadcrumb-dot">•</span>
            <span>Dashboards</span>
            <span className="breadcrumb-dot">•</span>
            <span>Analytics</span>
          </div>
        </div>
        <div className="analytics-header-right">
          <button 
            className="analytics-action-btn" 
            onClick={fetchAnalytics}
            title="Refresh Data"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Royal Bikes Info Banner */}
      <div className="royal-banner-card">
        <div className="royal-banner-content">
          <h2 className="royal-banner-title">
            {data.company_info?.name || 'ROYAL BIKES'}
          </h2>
          <p className="royal-banner-address">
            {data.company_info?.address || '104/1, ERUKKANCHERY HIGH ROADSHARMA NAGAR, VYASARPADI,CHENNAI - 600039'}
          </p>

          <div className="royal-banner-details">
            <div className="banner-detail-item">
              <Mail size={15} className="banner-icon" />
              <span>{data.company_info?.email || 'royalbikes2020@gmail.com'}</span>
            </div>
            <div className="banner-detail-item">
              <Phone size={15} className="banner-icon" />
              <span>{data.company_info?.phone || '04443537237 / 8925270575'}</span>
            </div>
            <div className="banner-detail-item">
              <CheckCircle2 size={15} className="banner-icon" />
              <span>{data.company_info?.version || 'Publish version 2.3.3'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid (2x2) */}
      <div className="analytics-metrics-grid">
        {/* Card 1: Stock on hand */}
        <div className="analytics-metric-card card-stock">
          <div className="metric-number">
            {loading ? <RefreshCw size={28} className="animate-spin text-muted" /> : data.stock_on_hand}
          </div>
          <div className="metric-label">Stock on hand</div>
        </div>

        {/* Card 2: Today Sales */}
        <div className="analytics-metric-card card-sales">
          <div className="metric-number">
            {loading ? <RefreshCw size={28} className="animate-spin text-muted" /> : data.today_sales}
          </div>
          <div className="metric-label">Today Sales</div>
        </div>

        {/* Card 3: Today Purchase */}
        <div className="analytics-metric-card card-purchase">
          <div className="metric-number">
            {loading ? <RefreshCw size={28} className="animate-spin text-muted" /> : data.today_purchase}
          </div>
          <div className="metric-label">Today Purchase</div>
        </div>

        {/* Card 4: Today Expense */}
        <div className="analytics-metric-card card-expense">
          <div className="metric-number">
            {loading ? <RefreshCw size={28} className="animate-spin text-muted" /> : data.today_expense}
          </div>
          <div className="metric-label">Today Expense</div>
        </div>
      </div>
    </div>
  );
};
