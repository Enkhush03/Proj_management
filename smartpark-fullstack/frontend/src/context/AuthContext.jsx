import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'smartpark_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartpark_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => {
        const nextUser = data?.user ?? data;
        setUser(nextUser || null);
        if (nextUser) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        }
      })
      .catch(() => {
        localStorage.removeItem('smartpark_token');
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (token, nextUser) => {
        localStorage.setItem('smartpark_token', token);
        if (nextUser) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        }
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem('smartpark_token');
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
