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
  padding: 20px; /* Add padding as needed */
  box-sizing: border-box;
  width: 100%;
  align-items: stretch; /* Ensure children stretch to match height */
`;

// Left section for SOC Roles and Weather Forecast
const LeftSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  gap: 20px;
  width: 100%;
`;

// Right section for the News widget
const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Stretch to fill the container */
  padding: 0; /* Remove padding to align flush against the right edge */
  margin-left: 20px; /* Space between LeftSection and RightSection */

  /* Remove the border-left to eliminate the white border */
  border-left: none;

  /* Ensure the News widget matches the height of the Weather Forecast */
  height: 100%; /* Fill the available height */

  @media (max-width: 1200px) {
    display: none; /* Hide on smaller screens or adjust as needed */
  }
`;

// Roles Section styled component
const RolesSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
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
      "Threat Hunter PT2": rotation[1],
      "Tech Desk": rotation[2],
      "Threat Intel (WFH Week)": rotation[3]
    };
  };

  // Get current week number
  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();
  const rotation = getRotation(currentWeekNumber);

  // Create role assignments
  const roleAssignments = [
    { role: "Threat Hunter", employee: rotation["Threat Hunter"] },
    { role: "Threat Hunter PT2", employee: rotation["Threat Hunter PT2"] },
    { role: "Tech Desk", employee: rotation["Tech Desk"] },
    { role: "Threat Intel (WFH Week)", employee: rotation["Threat Intel (WFH Week)"] }
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
          <WeatherOverview />
        </LeftSection>
        <RightSection>
          <CyberSecurityNews /> {/* Add the news widget here */}
        </RightSection>
      </MainContent>
      <Footer />
    </DashboardContainer>
  );
};

export default Dashboard;
