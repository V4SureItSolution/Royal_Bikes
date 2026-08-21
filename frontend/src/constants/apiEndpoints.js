const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`
  },
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    BY_ID: (id) => `${API_BASE_URL}/products/${id}`
  },
  CUSTOMERS: {
    BASE: `${API_BASE_URL}/customers`,
    BY_ID: (id) => `${API_BASE_URL}/customers/${id}`
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id) => `${API_BASE_URL}/users/${id}`
  }
};
