// src/components/Login.js

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import logo from '../assets/logo.png'; // Importing the logo

const LoginContainer = styled.div`
  background: var(--background-color);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginWrapper = styled.div`
  background: var(--secondary-background);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.img`
  height: 60px; /* Adjust the height as needed */
  width: auto;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: var(--accent-color);
  margin-bottom: 30px;
  font-size: 1.8em;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  background: var(--card-background);
  color: var(--text-color);
  font-size: 1em;

  &:focus {
    outline: none;
    border: 1px solid var(--accent-color);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: var(--accent-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;

  &:hover {
    background: var(--hover-accent);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 10px;
`;

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState(''); // Renamed from 'email' to 'username'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend login endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        username, // Changed from 'email' to 'username'
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuth(true);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password'); // Updated error message
    }
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <Logo src={logo} alt="Company Logo" />
        <Title>BeyondID SOC Rotation Dashboard</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text" // Changed from 'email' to 'text'
            placeholder="Username" // Changed from 'Email' to 'Username'
            value={username} // Updated state variable
            onChange={(e) => setUsername(e.target.value)} // Updated state setter
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Login</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
