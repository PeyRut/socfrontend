// src/components/RoleCard.js

import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaUserShield, FaHeadset, FaRegClock } from 'react-icons/fa';

const Card = styled.div`
  background: var(--card-background);
  border-radius: 16px;
  padding: 30px;
  color: var(--text-color);
  text-align: center;
  width: 280px;
  min-height: 150px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
  }
`;

const RoleIcon = styled.div`
  font-size: 2.5em;
  margin-bottom: 15px;
  color: var(--accent-color);
`;

const RoleName = styled.h2`
  font-size: 1.6em;
  margin-bottom: 10px;
  font-weight: 600;
`;

const EmployeeName = styled.p`
  font-size: 1.2em;
  color: var(--role-text-color);
`;

const RoleCard = ({ role, employee }) => {
  const roleIcons = {
    "Threat Hunter": <FaSearch />,
    "Threat Hunter Manager": <FaUserShield />,
    "On-Call (Tech Desk)": <FaHeadset />,
    "Standby (Off Thurs-Fri)": <FaRegClock />
  };

  return (
    <Card onClick={() => alert(`More details about ${employee}`)}>
      <RoleIcon>{roleIcons[role]}</RoleIcon>
      <RoleName>{role}</RoleName>
      <EmployeeName>{employee}</EmployeeName>
    </Card>
  );
};

export default RoleCard;
