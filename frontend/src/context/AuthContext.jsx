import React, { createContext, useState, useContext, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, getUserMe } from '../features/user/api/userAuthApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user data
    const checkAuth = async () => {
      const token = localStorage.getItem('user_token');
      if (token) {
        try {
          const response = await getUserMe();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('user_token');
          }
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('user_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.password,
        phone: userData.phone || null,
      });

      if (response.success) {
        // Auto-login after registration
        localStorage.setItem('user_token', response.data.token);
        setUser(response.data.user);
        return { success: true, message: response.message };
      }
      
      return { success: false, message: response.message || 'Kayıt başarısız.' };
    } catch (error) {
      const message = error.response?.data?.message || 'Kayıt işlemi başarısız.';
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      
      if (response.success) {
        localStorage.setItem('user_token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }

      return { success: false, message: response.message || 'Giriş başarısız.' };
    } catch (error) {
      const message = error.response?.data?.message || 'Giriş işlemi başarısız.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      localStorage.removeItem('user_token');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getUserMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Ignore errors
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;