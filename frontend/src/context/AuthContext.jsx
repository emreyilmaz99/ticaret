import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const storedUser = localStorage.getItem('customer_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    // Simulate backend registration
    const users = JSON.parse(localStorage.getItem('mock_users_db') || '[]');
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'Bu e-posta adresi zaten kayıtlı.' };
    }
    
    users.push(userData);
    localStorage.setItem('mock_users_db', JSON.stringify(users));
    return { success: true, message: 'Kayıt başarılı.' };
  };

  const login = (email, password) => {
    // Simulate backend login validation
    const users = JSON.parse(localStorage.getItem('mock_users_db') || '[]');
    
    // Also allow a hardcoded demo user for testing if needed, or just rely on registration
    // For this request, we strictly check the "database"
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const userObj = { name: user.name, email: user.email, role: 'customer' };
      setUser(userObj);
      localStorage.setItem('customer_user', JSON.stringify(userObj));
      return { success: true };
    }
    
    return { success: false, message: 'Kayıt bulunamadı veya şifre hatalı.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customer_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
