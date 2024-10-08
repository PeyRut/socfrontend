// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ActivateAccount from './components/ActivateAccount';
import { jwtDecode } from 'jwt-decode';

const GlobalStyle = createGlobalStyle`
  :root {
    --background-color: #121212;
    --secondary-background: #1e1e1e;
    --card-background: #1e1e1e;
    --text-color: #e0e0e0;
    --accent-color: #bb86fc;
    --hover-accent: #9a67ea;
    --holiday-background: #e74c3c;
    --button-background: #bb86fc;
    --button-text-color: #121212;
    --role-text-color: #7f8c8d;

    --base-font-size: 16px;
    --font-size-small: calc(var(--base-font-size) * 0.875);
    --font-size-medium: var(--base-font-size);
    --font-size-large: calc(var(--base-font-size) * 1.25);
  }

  html {
    font-size: 100%; /* Default 16px */
    @media (min-width: 1200px) {
      font-size: 125%; /* Increase font size on larger screens */
    }
    @media (max-width: 768px) {
      font-size: 90%; /* Decrease font size on smaller screens */
    }
  }

  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background: var(--background-color);
    color: var(--text-color);
    overflow-x: hidden;
  }

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--secondary-background);
  }
  ::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      setIsAdmin(decoded.isAdmin || false);
    } catch (err) {
      console.error('Error decoding token:', err);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <AppContainer>
        <GlobalStyle />
        <Routes>
          <Route path="/activate/:token" element={<ActivateAccount />} />
          {!isAuthenticated ? (
            <Route path="*" element={<Login setAuth={setIsAuthenticated} />} />
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route
                path="/admin"
                element={isAdmin ? <AdminPanel /> : <Navigate to="/" replace />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
