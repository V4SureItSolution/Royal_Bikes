import { fetchWithAuth } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  async login(username, password) {
    const res = await fetchWithAuth(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.success && res.data?.access_token) {
      localStorage.setItem('royalbikes_token', res.data.access_token);
      localStorage.setItem('royalbikes_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async register(username, email, password, role = 'staff') {
    return await fetchWithAuth(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role })
    });
  },

  async getCurrentUser() {
    return await fetchWithAuth(API_ENDPOINTS.AUTH.ME);
  },

  logout() {
    localStorage.removeItem('royalbikes_token');
    localStorage.removeItem('royalbikes_user');
  }
};
