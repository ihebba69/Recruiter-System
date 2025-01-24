// src/context/AuthContext.js
import React, { useState, createContext } from 'react';
import { login, register } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const loginHandler = async (userCredentials) => {
    try {
      const response = await login(userCredentials);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const registerHandler = async (userDetails) => {
    try {
      await register(userDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login: loginHandler, logout: logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};