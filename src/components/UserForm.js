// src/components/UserForm.js

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 10px;
  margin-bottom: 5px;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 10px;
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

const Select = styled.select`
  padding: 10px;
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
  padding: 10px;
  background: var(--accent-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background: var(--hover-accent);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: #2ecc71;
  margin-top: 10px;
`;

const UserForm = ({ onClose, editingUser }) => {
  const [username, setUsername] = useState(editingUser ? editingUser.username : '');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(editingUser ? editingUser.isAdmin : false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditing = Boolean(editingUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Username is required');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      if (isEditing) {
        // Update user
        const payload = {
          username,
          isAdmin,
        };
        if (password) {
          payload.password = password;
        }

        await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${editingUser._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('User updated successfully');
      } else {
        // Add new user
        if (!password) {
          setError('Password is required for new users');
          return;
        }
        const payload = {
          username,
          password,
          isAdmin,
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('User added successfully');
      }
      setError('');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.error || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>Username</Label>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <Label>Password {isEditing && '(leave blank to keep current password)'}</Label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={isEditing ? 'New Password' : 'Password'}
      />

      <Label>Admin</Label>
      <Select
        value={isAdmin}
        onChange={(e) => setIsAdmin(e.target.value === 'true')}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </Select>

      <Button type="submit">{isEditing ? 'Update User' : 'Add User'}</Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </Form>
  );
};

export default UserForm;
