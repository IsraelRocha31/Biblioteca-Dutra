import { useState, useEffect } from 'react';
import { isLoggedIn, clearToken, getPerfil, setToken } from './api';
import type { Admin } from './types';
import Dashboard from './components/Dashboard';

export default function App() {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const verificar = async () => {
      if (isLoggedIn()) {
        try {
          const data = await getPerfil();
          setAdmin(data.admin);
        } catch {
          clearToken();
        }
      }
    };
    verificar();
  }, []);

  const handleLogin = (adminData: Admin, token: string) => {
    setToken(token);
    setAdmin(adminData);
  };

  const handleLogout = () => {
    clearToken();
    setAdmin(null);
  };

  return <Dashboard admin={admin} onLogin={handleLogin} onLogout={handleLogout} />;
}
