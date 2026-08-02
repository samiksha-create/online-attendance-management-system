// src/context/AuthContext.jsx
// Provides global authentication state (user, login, logout) via React Context

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on app load
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // login: calls backend, stores user+token in state & localStorage
  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    const userData = res.data.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => useContext(AuthContext);
