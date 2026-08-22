import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const rtnPaymentService = {
  async getRtnPayments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.RTN_PAYMENTS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getRtnPaymentById(id) {
    return await fetchWithAuth(API_ENDPOINTS.RTN_PAYMENTS.BY_ID(id));
  },

  async createRtnPayment(rtnData) {
    return await fetchWithAuth(API_ENDPOINTS.RTN_PAYMENTS.BASE, {
      method: 'POST',
      body: JSON.stringify(rtnData)
    });
  },

  async deleteRtnPayment(id) {
    return await fetchWithAuth(API_ENDPOINTS.RTN_PAYMENTS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
