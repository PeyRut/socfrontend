// src/components/RoleCard.js

import React from 'react';
import styled from 'styled-components';
import { Player } from '@lottiefiles/react-lottie-player'; // Import Lottie Player

// Lottie animation JSON files
import ThreatHunterAnimation from '../assets/threat-hunter.json';
import ManagerAnimation from '../assets/manager.json';
import TechDeskAnimation from '../assets/tech-desk.json';
import WfhAnimation from '../assets/wfh-week.json';

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
  margin-bottom: 15px;
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
  const roleAnimations = {
    "Threat Hunter": ThreatHunterAnimation,
    "Threat Hunter Manager": ManagerAnimation,
    "Tech Desk": TechDeskAnimation,
    "Threat Intel (WFH Week)": WfhAnimation,
  };

  return (
    <Card onClick={() => alert(`More details about ${employee}`)}>
      <RoleIcon>
        <Player
          autoplay
          loop
          src={roleAnimations[role]} // Load the correct animation based on the role
          style={{ height: '80px', width: '80px' }}
        />
      </RoleIcon>
      <RoleName>{role}</RoleName>
      <EmployeeName>{employee}</EmployeeName>
    </Card>
  );
};

export default RoleCard;
