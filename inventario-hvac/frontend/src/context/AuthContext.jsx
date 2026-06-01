import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('hvac_token', data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('hvac_token');
    setUser(null);
  }

  async function loadUser() {
    const token = localStorage.getItem('hvac_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch('/auth/me');
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('hvac_token');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
