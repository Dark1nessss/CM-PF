import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  token: null,
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      // Optionally, you could also load user info here.
      if (token) {
        setAuthState({
          token,
          user: null, // Or fetch the user details if needed.
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setAuthState({
          token: null,
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error loading token:', error);
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (token, user = null) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      setAuthState({
        token,
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
