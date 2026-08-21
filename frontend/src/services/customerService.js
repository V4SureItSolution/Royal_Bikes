import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const customerService = {
  async getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.CUSTOMERS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getCustomerById(id) {
    return await fetchWithAuth(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  async createCustomer(customerData) {
    return await fetchWithAuth(API_ENDPOINTS.CUSTOMERS.BASE, {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  },

  async updateCustomer(id, customerData) {
    return await fetchWithAuth(API_ENDPOINTS.CUSTOMERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(customerData)
    });
  },

  async deleteCustomer(id) {
    return await fetchWithAuth(API_ENDPOINTS.CUSTOMERS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
