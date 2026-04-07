import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartpark_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('smartpark_token');
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
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem('smartpark_token');
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
