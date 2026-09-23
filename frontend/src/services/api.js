export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('royalbikes_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response' }));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('royalbikes_token');
      localStorage.removeItem('royalbikes_user');
    }
    throw new Error(data.message || `HTTP Error ${response.status}`);
  }

  return data;
};
