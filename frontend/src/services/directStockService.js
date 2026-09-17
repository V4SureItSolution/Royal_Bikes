import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const STORAGE_KEY = 'royalbikes_direct_stocks';

// Default initial stock sample for demonstration and fallback
const INITIAL_DEMO_STOCKS = [
  {
    id: 101,
    organization: 'ROYAL BIKES',
    date: '12-08-2026',
    vendor: 'ROYAL ENFIELD DISTRIBUTORS',
    product: 'Royal Enfield Classic 350',
    quantity: 1,
    engine_number: 'UCE350EN98231',
    engineNumber: 'UCE350EN98231',
    chassis_number: 'ME3J350CHS44812',
    chassisNumber: 'ME3J350CHS44812',
    color: 'Stealth Black',
    brand: 'ROYAL ENFIELD',
    notes: 'In showroom stock'
  },
  {
    id: 102,
    organization: 'ROYAL BIKES',
    date: '12-08-2026',
    vendor: 'ROYAL ENFIELD DISTRIBUTORS',
    product: 'Royal Enfield Hunter 350',
    quantity: 1,
    engine_number: 'HN350EN77192',
    engineNumber: 'HN350EN77192',
    chassis_number: 'ME3J350CHS99120',
    chassisNumber: 'ME3J350CHS99120',
    color: 'Dapper Ash',
    brand: 'ROYAL ENFIELD',
    notes: 'Warehouse unit'
  },
  {
    id: 103,
    organization: 'ROYAL BIKES',
    date: '12-08-2026',
    vendor: 'HARDEEP HONDA',
    product: 'HONDA ACTIVA 6G STD',
    quantity: 1,
    engine_number: 'HND110EN66321',
    engineNumber: 'HND110EN66321',
    chassis_number: 'HNDACTCHS55410',
    chassisNumber: 'HNDACTCHS55410',
    color: 'Decent Blue Metallic',
    brand: 'HONDA',
    notes: 'Ready for delivery'
  },
  {
    id: 104,
    organization: 'ROYAL BIKES',
    date: '12-08-2026',
    vendor: 'HERO MOTOCORP DEALERS',
    product: 'HERO SPLENDOR PLUS',
    quantity: 1,
    engine_number: 'HER97EN11489',
    engineNumber: 'HER97EN11489',
    chassis_number: 'HEROSPCHS88291',
    chassisNumber: 'HEROSPCHS88291',
    color: 'Black with Silver',
    brand: 'HERO',
    notes: 'Ready in stock'
  }
];

export const directStockService = {
  getStoredStocks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored direct stocks', e);
    }
    // Seed initial demo stocks
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_STOCKS));
    return INITIAL_DEMO_STOCKS;
  },

  saveStoredStocks(stocks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
      window.dispatchEvent(new Event('directStockUpdated'));
    } catch (e) {
      console.warn('Failed to save direct stocks to localStorage', e);
    }
  },

  async getDirectStocks() {
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.DIRECT_STOCK.BASE);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        this.saveStoredStocks(res.data);
        return res;
      }
    } catch (err) {
      console.warn('API getDirectStocks failed, using local storage fallback:', err);
    }
    return { success: true, data: this.getStoredStocks() };
  },

  async getAllStocks() {
    const res = await this.getDirectStocks();
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
    return this.getStoredStocks();
  },

  async createDirectStock(stockData) {
    const normalized = {
      ...stockData,
      engine_number: (stockData.engineNumber || stockData.engine_number || '').trim(),
      engineNumber: (stockData.engineNumber || stockData.engine_number || '').trim(),
      chassis_number: (stockData.chassisNumber || stockData.chassis_number || '').trim(),
      chassisNumber: (stockData.chassisNumber || stockData.chassis_number || '').trim(),
      color: (stockData.color || '').trim(),
      product: (stockData.product || stockData.model || '').trim()
    };

    // Update local storage immediately
    const current = this.getStoredStocks();
    const newEntry = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      ...normalized
    };
    const updated = [newEntry, ...current];
    this.saveStoredStocks(updated);

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.DIRECT_STOCK.BASE, {
        method: 'POST',
        body: JSON.stringify(normalized)
      });
      if (res && res.success && res.data) {
        // Sync server ID
        const finalEntries = updated.map(item => item.id === newEntry.id ? res.data : item);
        this.saveStoredStocks(finalEntries);
        return res;
      }
    } catch (err) {
      console.warn('Backend offline or failed to save stock, preserved in local storage:', err);
    }

    return { success: true, data: newEntry, message: 'Stock saved locally' };
  },

  async deleteDirectStock(id) {
    const current = this.getStoredStocks();
    const updated = current.filter(item => String(item.id) !== String(id));
    this.saveStoredStocks(updated);

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.DIRECT_STOCK.BY_ID(id), {
        method: 'DELETE'
      });
      return res;
    } catch (err) {
      console.warn('Backend delete error, removed locally:', err);
    }
    return { success: true, message: 'Stock removed locally' };
  }
};
