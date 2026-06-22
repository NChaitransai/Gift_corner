import { createContext, useState, useContext } from 'react';
import { authAPI, loginAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('giftcorner_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getUsers();
      const users = response.data;
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        await loginAPI.saveLogin({
          userId: foundUser.id,
          email: foundUser.email,
          loginTime: new Date().toISOString(),
        });

        // Exclude password from stored user for security
        const safeUser = { ...foundUser };
        delete safeUser.password;
        
        localStorage.setItem('giftcorner_user', JSON.stringify(safeUser));
        setUser(safeUser);
        setLoading(false);
        return safeUser;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getUsers();
      const users = response.data;
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        throw new Error('Email is already registered');
      }

      const newUser = {
        name,
        email: email.toLowerCase(),
        password,
        role: 'user', // Default role
      };

      const createResponse = await authAPI.register(newUser);
      const safeUser = { ...createResponse.data };
      delete safeUser.password;

      localStorage.setItem('giftcorner_user', JSON.stringify(safeUser));
      setUser(safeUser);
      setLoading(false);
      return safeUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('giftcorner_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
