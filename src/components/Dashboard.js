// src/components/Dashboard.js

import React, { useState } from 'react';               // <-- NEW: import useState
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
  border-left: none; /* Remove the border-left to eliminate the white border */
  height: 100%; /* Ensure the News widget matches the height of the Weather Forecast */

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

// NEW: A small container to hold the week-selector buttons.
const WeekSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

// NEW: Some quick styling for the "Previous Week"/"Next Week" buttons.
const WeekButton = styled.button`
  background: var(--accent-color);
  color: var(--button-text-color);
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;

  &:hover {
    background: var(--hover-accent);
  }
`;

const Dashboard = () => {
  // Define remote start/end dates for Willis
  const remoteStart = moment("2025-01-27", "YYYY-MM-DD");
  const remoteEnd = moment("2025-04-14", "YYYY-MM-DD");

  // Get current date and week number
  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();

  // Check if current date is within the remote window
  const isRemotePeriod =
    currentDate.isSameOrAfter(remoteStart, 'day') &&
    currentDate.isBefore(remoteEnd, 'day');

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
      // Force the first remote week to begin Monday, Jan 27, 2025
      const weeksSinceStart = currentDate
        .clone()
        .startOf('isoWeek')
        .diff(remoteStart.clone().startOf('isoWeek'), 'weeks');
      const index = weeksSinceStart % 3;
      const newRotation = remoteRotations[index];

      return {
        "Threat Hunter": newRotation[0],
        "Threat Hunter PT2": newRotation[1],
        "Tech Desk": newRotation[2],
        "Remote": "Willis"
      };
    } else {
      // Use original 4-week rotation outside remote window
      const rotation = standardRotations[(week - 1) % 4];
      return {
        "Threat Hunter": rotation[0],
        "Threat Hunter PT2": rotation[1],
        "Tech Desk": rotation[2],
        "Threat Intel (WFH Week)": rotation[3]
      };
    }
  };

  // ----------------------------------------------------------------------
  //  KEEPING existing code above. Now let's add "week selector" logic below
  // ----------------------------------------------------------------------

  // NEW: Track the user’s selected ISO week in state.
  const [selectedWeek, setSelectedWeek] = useState(currentWeekNumber);

  // NEW: We'll compute a date object representing that selectedWeek.
  //      This is how we handle the "remote" window logic for ANY week.
  const displayedDate = moment().isoWeek(selectedWeek);

  // NEW: Check if THAT date is in the remote period
  const displayedIsRemotePeriod =
    displayedDate.isSameOrAfter(remoteStart, 'day') &&
    displayedDate.isBefore(remoteEnd, 'day');

  // NEW: We use displayedDate for the rotation, not currentDate
  const getDisplayedRotation = (date) => {
    if (displayedIsRemotePeriod) {
      const weeksSinceStart = date
        .clone()
        .startOf('isoWeek')
        .diff(remoteStart.clone().startOf('isoWeek'), 'weeks');
      const index = weeksSinceStart % 3;
      const newRotation = remoteRotations[index];

      return {
        "Threat Hunter": newRotation[0],
        "Threat Hunter PT2": newRotation[1],
        "Tech Desk": newRotation[2],
        "Remote": "Willis"
      };
    } else {
      // For any non-remote date, figure out the correct 4-week rotation
      const weekNum = date.isoWeek();
      const rotation = standardRotations[(weekNum - 1) % 4];
      return {
        "Threat Hunter": rotation[0],
        "Threat Hunter PT2": rotation[1],
        "Tech Desk": rotation[2],
        "Threat Intel (WFH Week)": rotation[3]
      };
    }
  };

  // NEW: This is our "actual" rotation for the selected week
  const displayedRotation = getDisplayedRotation(displayedDate);

  // NEW: Build role assignments for the selected week
  const displayedRoleAssignments = displayedIsRemotePeriod
    ? [
        { role: "Threat Hunter", employee: displayedRotation["Threat Hunter"] },
        { role: "Threat Hunter PT2", employee: displayedRotation["Threat Hunter PT2"] },
        { role: "Tech Desk", employee: displayedRotation["Tech Desk"] },
        { role: "Remote", employee: displayedRotation["Remote"] },
      ]
    : [
        { role: "Threat Hunter", employee: displayedRotation["Threat Hunter"] },
        { role: "Threat Hunter PT2", employee: displayedRotation["Threat Hunter PT2"] },
        { role: "Tech Desk", employee: displayedRotation["Tech Desk"] },
        { role: "Threat Intel (WFH Week)", employee: displayedRotation["Threat Intel (WFH Week)"] }
      ];

  // ------------------------------------------------------------------------
  //  The lines below are your ORIGINAL code for the "current" week rotation.
  //  We are NOT removing it, as requested. We simply won't use it in the UI.
  // ------------------------------------------------------------------------
  const rotation = getRotation(currentWeekNumber);
  const roleAssignments = isRemotePeriod
    ? [
        { role: "Threat Hunter", employee: rotation["Threat Hunter"] },
        { role: "Threat Hunter PT2", employee: rotation["Threat Hunter PT2"] },
        { role: "Tech Desk", employee: rotation["Tech Desk"] },
        { role: "Remote", employee: rotation["Remote"] },
      ]
    : [
        { role: "Threat Hunter", employee: rotation["Threat Hunter"] },
        { role: "Threat Hunter PT2", employee: rotation["Threat Hunter PT2"] },
        { role: "Tech Desk", employee: rotation["Tech Desk"] },
        { role: "Threat Intel (WFH Week)", employee: rotation["Threat Intel (WFH Week)"] }
      ];

  // NEW: Handlers for the "Previous Week" / "Next Week" buttons
  const handlePrevWeek = () => {
    setSelectedWeek((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) => prev + 1);
  };

  return (
    <DashboardContainer>
      <Navbar />
      <Header />
      <MainContent>
        <LeftSection>
          {/* NEW: Render our week selector above the RolesSection */}
          <WeekSelector>
            <WeekButton onClick={handlePrevWeek}>Previous Week</WeekButton>
            <WeekButton onClick={handleNextWeek}>Next Week</WeekButton>
          </WeekSelector>

          {/* NEW: Instead of roleAssignments, we render displayedRoleAssignments */}
          <RolesSection>
            {displayedRoleAssignments.map((assignment, index) => (
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
          <CyberSecurityNews />
        </RightSection>
      </MainContent>
      <Footer />
    </DashboardContainer>
  );
};

export default Dashboard;
