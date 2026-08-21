import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('royalbikes_token');
      const storedUser = localStorage.getItem('royalbikes_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await authService.getCurrentUser();
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('royalbikes_user', JSON.stringify(res.data));
          }
        } catch (e) {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    if (res.success) {
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
