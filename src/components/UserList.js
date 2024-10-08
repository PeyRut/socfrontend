// src/components/UserList.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--secondary-background);
  color: var(--text-color);
`;

const Th = styled.th`
  padding: 12px;
  border-bottom: 1px solid #444;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #444;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;

  &:hover {
    color: var(--hover-accent);
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #e74c3c;

  &:hover {
    color: #c0392b;
  }
`;

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <Table>
      <thead>
        <tr>
          <Th>Username</Th>
          <Th>Admin</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <Td>{user.username}</Td>
            <Td>{user.isAdmin ? 'Yes' : 'No'}</Td>
            <Td>
              <ActionButton onClick={() => onEdit(user)} title="Edit User">
                <FaEdit />
              </ActionButton>
              <DeleteButton onClick={() => handleDelete(user._id)} title="Delete User">
                <FaTrash />
              </DeleteButton>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserList;
