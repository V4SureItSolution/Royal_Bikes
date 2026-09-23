import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const bookingOrderService = {
  async getBookingOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.BOOKING_ORDERS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getBookingOrderById(id) {
    return await fetchWithAuth(API_ENDPOINTS.BOOKING_ORDERS.BY_ID(id));
  },

  async createBookingOrder(orderData) {
    return await fetchWithAuth(API_ENDPOINTS.BOOKING_ORDERS.BASE, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async updateBookingOrder(id, orderData) {
    return await fetchWithAuth(API_ENDPOINTS.BOOKING_ORDERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(orderData)
    });
  },

  async deleteBookingOrder(id) {
    return await fetchWithAuth(API_ENDPOINTS.BOOKING_ORDERS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
