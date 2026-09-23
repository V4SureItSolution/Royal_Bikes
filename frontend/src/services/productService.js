import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.PRODUCTS.BASE}${query ? `?${query}` : ''}`;
    return await fetchWithAuth(url);
  },

  async getProductById(id) {
    return await fetchWithAuth(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  async createProduct(productData) {
    return await fetchWithAuth(API_ENDPOINTS.PRODUCTS.BASE, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return await fetchWithAuth(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return await fetchWithAuth(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
      method: 'DELETE'
    });
  }
};
