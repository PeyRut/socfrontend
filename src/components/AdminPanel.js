// src/components/AdminPanel.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import UserList from './UserList';

const AdminContainer = styled.div`
  padding: 20px;
  background: var(--background-color);
  min-height: 100vh;
  color: var(--text-color);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: var(--accent-color);
  border: none;
  color: var(--button-text-color);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-right: 20px;

  &:hover {
    background: var(--hover-accent);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.8em;
`;

const AddUserButton = styled.button`
  display: flex;
  align-items: center;
  background: var(--accent-color);
  border: none;
  color: var(--button-text-color);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-left: auto;

  &:hover {
    background: var(--hover-accent);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: var(--secondary-background);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  return (
    <AdminContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back
        </BackButton>
        <Title>Admin Panel</Title>
        <AddUserButton onClick={() => setShowModal(true)}>
          <FaPlus style={{ marginRight: '8px' }} />
          Add User
        </AddUserButton>
      </Header>
      <UserList onEdit={handleEditUser} />
      {showModal && (
        <Modal>
          <ModalContent>
            <UserForm onClose={handleCloseModal} editingUser={editingUser} />
          </ModalContent>
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;
