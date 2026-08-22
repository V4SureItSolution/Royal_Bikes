import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const deliveryChallanService = {
  async getDeliveryChallans(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.DELIVERY_CHALLANS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getDeliveryChallanById(id) {
    return await fetchWithAuth(API_ENDPOINTS.DELIVERY_CHALLANS.BY_ID(id));
  },

  async createDeliveryChallan(dcData) {
    return await fetchWithAuth(API_ENDPOINTS.DELIVERY_CHALLANS.BASE, {
      method: 'POST',
      body: JSON.stringify(dcData)
    });
  },

  async deleteDeliveryChallan(id) {
    return await fetchWithAuth(API_ENDPOINTS.DELIVERY_CHALLANS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
