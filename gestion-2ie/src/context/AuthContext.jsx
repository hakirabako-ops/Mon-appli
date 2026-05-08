// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';


const AuthContext = createContext(null);
const TOKEN_KEY   = 'auth_token';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage : vérifier si un token existe déjà
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchMe(token)
        .then(setUser)
        .catch(() => localStorage.removeItem(TOKEN_KEY))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (token) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Token invalide');
    return res.json(); // { id, nom, email }
  };

  const login = useCallback(async (email, password) => {
    const res  = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Identifiants incorrects');
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.utilisateur);  // ← correspond au champ retourné par Express
    return data.utilisateur;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
