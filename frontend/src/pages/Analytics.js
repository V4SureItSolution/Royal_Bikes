import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, CheckCircle2, RotateCw, Home, Layers, ShoppingBag, TrendingUp, CreditCard } from 'lucide-react';
import { reportService } from '../services/reportService';

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    stock_on_hand: 0,
    today_sales: '-',
    today_purchase: '-',
    today_expense: '-',
    total_stock_count: 0,
    total_sales_count: 0,
    total_customers: 0,
    company_info: {
      name: 'ROYAL BIKES',
      address: '104/1, ERUKKANCHERY HIGH ROADSHARMA NAGAR, VYASARPADI,CHENNAI - 600039',
      email: 'royalbikes2020@gmail.com',
      phone: '04443537237 / 8925270575',
      version: 'Publish version 2.3.3'
    }
  });

  const getLocalStockCount = () => {
    try {
      const stored = localStorage.getItem('royalbikes_direct_stocks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch (e) {}
    return 0;
  };

  const fetchAnalytics = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await reportService.getAnalytics();
      if (res && res.success && res.data) {
        const backendData = res.data;
        const localStockCount = getLocalStockCount();
        
        // Ensure stock_on_hand reflects local updates if higher
        const syncedStock = Math.max(backendData.stock_on_hand || 0, localStockCount);

        setData({
          ...backendData,
          stock_on_hand: syncedStock
        });
      }
    } catch (err) {
      console.warn('Syncing with local storage fallback:', err);
      const localStock = getLocalStockCount();
      setData((prev) => ({
        ...prev,
        stock_on_hand: localStock > 0 ? localStock : prev.stock_on_hand
      }));
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    // Event listeners to auto-sync whenever new Direct Stock, Delivery Challan or Reports change
    const handleSync = () => fetchAnalytics();

    window.addEventListener('directStockUpdated', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('directStockUpdated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [fetchAnalytics]);

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
            onClick={() => fetchAnalytics(true)}
            title="Sync & Refresh Dashboard Data"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCw size={16} className={refreshing || loading ? 'animate-spin' : ''} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Refresh</span>
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
            {loading ? <RotateCw size={26} className="animate-spin text-muted" /> : data.stock_on_hand}
          </div>
          <div className="metric-label">Stock on hand</div>
        </div>

        {/* Card 2: Today Sales */}
        <div className="analytics-metric-card card-sales">
          <div className="metric-number">
            {loading ? <RotateCw size={26} className="animate-spin text-muted" /> : data.today_sales}
          </div>
          <div className="metric-label">Today Sales</div>
        </div>

        {/* Card 3: Today Purchase */}
        <div className="analytics-metric-card card-purchase">
          <div className="metric-number">
            {loading ? <RotateCw size={26} className="animate-spin text-muted" /> : data.today_purchase}
          </div>
          <div className="metric-label">Today Purchase</div>
        </div>

        {/* Card 4: Today Expense */}
        <div className="analytics-metric-card card-expense">
          <div className="metric-number">
            {loading ? <RotateCw size={26} className="animate-spin text-muted" /> : data.today_expense}
          </div>
          <div className="metric-label">Today Expense</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

