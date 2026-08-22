import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const reportService = {
  async getCurrentStockReport(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.REPORTS.CURRENT_STOCK}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getDayBookReport(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.REPORTS.DAY_BOOK}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  }
};
