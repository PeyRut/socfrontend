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
  // Define remote start/end dates for Willis
  const remoteStart = moment("2025-01-27", "YYYY-MM-DD");
  const remoteEnd = moment("2025-04-14", "YYYY-MM-DD");

  // Get current date and week number
  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();

  // Check if current date is within the remote window
  const isRemotePeriod = currentDate.isSameOrAfter(remoteStart, 'day') && currentDate.isBefore(remoteEnd, 'day');

  // ORIGINAL (4-week) rotation logic
  const standardRotations = [
    ["Willis", "Jordan", "Randy", "Peyton"],
    ["Peyton", "Willis", "Jordan", "Randy"],
    ["Randy", "Peyton", "Willis", "Jordan"],
    ["Jordan", "Randy", "Peyton", "Willis"]
  ];

  // NEW (3-week) rotation logic for onsite roles while Willis is remote
  //   Week 1: Peyton (TH) / Jordan (TH PT2) / Randy (Tech Desk)
  //   Week 2: Randy (TH) / Peyton (TH PT2) / Jordan (Tech Desk)
  //   Week 3: Jordan (TH) / Randy (TH PT2) / Peyton (Tech Desk)
  const remoteRotations = [
    ["Peyton", "Jordan", "Randy"],
    ["Randy", "Peyton", "Jordan"],
    ["Jordan", "Randy", "Peyton"]
  ];

  // Helper function to get the correct rotation
  const getRotation = (week) => {
    if (isRemotePeriod) {
      // Use 3-week rotation for onsite roles + Willis in Remote
      const newRotation = remoteRotations[(week - 1) % 3];
      return {
        "Threat Hunter": newRotation[0],
        "Threat Hunter PT2": newRotation[1],
        "Tech Desk": newRotation[2],
        "Remote": "Willis" // Always Willis in the remote window
      };
    } else {
      // Use original 4-week rotation
      const rotation = standardRotations[(week - 1) % 4];
      return {
        "Threat Hunter": rotation[0],
        "Threat Hunter PT2": rotation[1],
        "Tech Desk": rotation[2],
        "Threat Intel (WFH Week)": rotation[3]
      };
    }
  };

  const rotation = getRotation(currentWeekNumber);

  // Create role assignments dynamically, respecting whether we are in the remote period
  const roleAssignments = isRemotePeriod
    ? [
        { role: "Threat Hunter", employee: rotation["Threat Hunter"] },
        { role: "Threat Hunter PT2", employee: rotation["Threat Hunter PT2"] },
        { role: "Tech Desk", employee: rotation["Tech Desk"] },
        { role: "Remote", employee: rotation["Remote"] }
      ]
    : [
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
