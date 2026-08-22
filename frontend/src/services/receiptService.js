import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const receiptService = {
  async getReceipts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.RECEIPTS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getReceiptById(id) {
    return await fetchWithAuth(API_ENDPOINTS.RECEIPTS.BY_ID(id));
  },

  async createReceipt(receiptData) {
    return await fetchWithAuth(API_ENDPOINTS.RECEIPTS.BASE, {
      method: 'POST',
      body: JSON.stringify(receiptData)
    });
  },

  async deleteReceipt(id) {
    return await fetchWithAuth(API_ENDPOINTS.RECEIPTS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
