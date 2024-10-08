// src/components/ActivateAccount.js

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ActivateContainer = styled.div`
  background: var(--background-color);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ActivateWrapper = styled.div`
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

const ActivateAccount = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleActivate = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    try {
      // Send activation request to backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/activate/${token}`, {
        password,
      });

      // Store token and navigate to dashboard
      localStorage.setItem('token', response.data.token);
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Activation error:', err);
      setError(err.response?.data?.error || 'Activation failed.');
    }
  };

  return (
    <ActivateContainer>
      <ActivateWrapper>
        <Logo src={require('../assets/logo.png')} alt="Company Logo" />
        <Title>Activate Your Account</Title>
        <form onSubmit={handleActivate}>
          <Input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit">Activate Account</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </ActivateWrapper>
    </ActivateContainer>
  );
};

export default ActivateAccount;
