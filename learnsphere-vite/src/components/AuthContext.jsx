import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI;

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUri}/Public/session`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        const userData = {
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar || 'https://via.placeholder.com/150',
        };
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      setIsLoading(false);
      return false;
    }
  }, [backendUri]);

  const login = async (userData) => {
    setIsLoading(true);
    const sessionSuccess = await fetchSession();
    if (sessionSuccess) {
      navigate('/', { replace: true });
    } else {
      const fallbackUserData = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar || 'https://via.placeholder.com/150',
      };
      setIsLoggedIn(true);
      setUser(fallbackUserData);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(fallbackUserData));
      navigate('/login', { replace: true });
    }
    setIsLoading(false);
    return sessionSuccess;
  };

  const logout = async () => {
    try {
      await fetch(`${backendUri}/Public/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getAuthHeaders, fetchSession, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);