// src/components/Dashboard.js

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Navbar from './Navbar';
import Header from './Header';
import RoleCard from './RoleCard';
import WeatherOverview from './WeatherOverview';
import CyberSecurityNews from './CyberSecurityNews';
import Footer from './Footer';

// Styled Components

// Container for the entire dashboard
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Main content area with Flexbox layout
const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 2vw;
  box-sizing: border-box;
  width: 100%;
  align-items: stretch;
  gap: 2vw;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 4vw;
  }
`;

// Left section for SOC Roles and Weather Forecast
const LeftSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vw;
  width: 100%;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

// Right section for the News widget
const RightSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  
  @media (max-width: 768px) {
    flex: 1;
    margin-top: 2vw;
  }
`;

// Roles Section styled component
const RolesSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2vw;
  width: 100%;

  @media (max-width: 768px) {
    gap: 4vw;
  }
`;

const WeatherSection = styled.section`
  width: 100%;
`;

const Dashboard = () => {
  // Rotation logic matching the Python script
  const getRotation = (week) => {
    const rotations = [
      ["Willis", "Jordan", "Randy", "Peyton"],
      ["Peyton", "Willis", "Jordan", "Randy"],
      ["Randy", "Peyton", "Willis", "Jordan"],
      ["Jordan", "Randy", "Peyton", "Willis"]
    ];
    const rotation = rotations[(week - 1) % 4];
    return {
      "Threat Hunter": rotation[0],
      "Threat Hunter Manager": rotation[1],
      "On-Call (Tech Desk)": rotation[2],
      "Standby (Off Thurs-Fri)": rotation[3]
    };
  };

  // Get current week number
  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();
  const rotation = getRotation(currentWeekNumber);

  // Create role assignments
  const roleAssignments = [
    { role: "Threat Hunter", employee: rotation["Threat Hunter"] },
    { role: "Threat Hunter Manager", employee: rotation["Threat Hunter Manager"] },
    { role: "On-Call (Tech Desk)", employee: rotation["On-Call (Tech Desk)"] },
    { role: "Standby (Off Thurs-Fri)", employee: rotation["Standby (Off Thurs-Fri)"] }
  ];

  return (
    <DashboardContainer>
      <Navbar />
      <Header />
      <MainContent>
        <LeftSection>
          <RolesSection>
            {roleAssignments.map((assignment, index) => (
              <RoleCard
                key={index}
                role={assignment.role}
                employee={assignment.employee}
              />
            ))}
          </RolesSection>
          <WeatherSection>
            <WeatherOverview />
          </WeatherSection>
        </LeftSection>
        <RightSection>
          <CyberSecurityNews />
        </RightSection>
      </MainContent>
      <Footer />
    </DashboardContainer>
  );
};

export default Dashboard;
