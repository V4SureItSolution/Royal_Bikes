import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const voucherService = {
  async getVouchers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.VOUCHERS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getVoucherById(id) {
    return await fetchWithAuth(API_ENDPOINTS.VOUCHERS.BY_ID(id));
  },

  async createVoucher(voucherData) {
    return await fetchWithAuth(API_ENDPOINTS.VOUCHERS.BASE, {
      method: 'POST',
      body: JSON.stringify(voucherData)
    });
  },

  async deleteVoucher(id) {
    return await fetchWithAuth(API_ENDPOINTS.VOUCHERS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
