// src/components/Dashboard.js

import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Navbar from './Navbar';
import Header from './Header';
import RoleCard from './RoleCard';
import WeatherOverview from './WeatherOverview';
import CyberSecurityNews from './CyberSecurityNews';
import Footer from './Footer';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  align-items: stretch;
`;

const LeftSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  margin-top: 57px; // or any value you like
  margin-left: 20px;
  border-left: none;
  height: 100%;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const RolesSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

/* 
  Updated so it won’t be white or push the other elements too far.
  We use position: relative for absolute positioning of children.
  - min-height: ensures there’s space for the absolutely positioned elements 
  - padding-top: also helps keep them from overlapping above the container
*/
const WeekSelectorContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  background-color: transparent; 
  min-height: 60px;       // Enough space for your buttons/text
  padding-top: 10px;      // Slight padding so absolute items aren’t clipped at the top
`;

/*
  Absolutely position your button group so you can tweak left/top easily.
*/
const ButtonGroup = styled.div`
  position: absolute;
  left: -210px;  // Adjust horizontally
  top: 30px;   // Adjust vertically

  display: flex;
  gap: 10px;
`;

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

/*
  Absolutely position your date text in a different spot.
  You can switch left/right, or tweak top/bottom as you like.
*/
const WeekRangeText = styled.span`
  position: absolute;
  right: 20px; // put it on the right side
  top: 15px;   // adjust vertical offset
  font-size: 1.1em;
  color: var(--accent-color);
  font-weight: 600;
`;

const Dashboard = () => {
  const remoteStart = moment("2025-01-27", "YYYY-MM-DD");
  const remoteEnd = moment("2025-04-14", "YYYY-MM-DD");
  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();
  const isRemotePeriod =
    currentDate.isSameOrAfter(remoteStart, "day") &&
    currentDate.isBefore(remoteEnd, "day");

  const standardRotations = [
    ["Willis", "Jordan", "Randy", "Peyton"],
    ["Peyton", "Willis", "Jordan", "Randy"],
    ["Randy", "Peyton", "Willis", "Jordan"],
    ["Jordan", "Randy", "Peyton", "Willis"],
  ];

  const remoteRotations = [
    ["Peyton", "Jordan", "Randy"],
    ["Randy", "Peyton", "Jordan"],
    ["Jordan", "Randy", "Peyton"],
  ];

  const getRotation = (week) => {
    if (isRemotePeriod) {
      const weeksSinceStart = currentDate
        .clone()
        .startOf("isoWeek")
        .diff(remoteStart.clone().startOf("isoWeek"), "weeks");
      const index = weeksSinceStart % 3;
      const newRotation = remoteRotations[index];
      return {
        "Threat Hunter": newRotation[0],
        "Threat Hunter PT2": newRotation[1],
        "Tech Desk": newRotation[2],
        Remote: "Willis",
      };
    } else {
      const rotation = standardRotations[(week - 1) % 4];
      return {
        "Threat Hunter": rotation[0],
        "Threat Hunter PT2": rotation[1],
        "Tech Desk": rotation[2],
        "Threat Intel (WFH Week)": rotation[3],
      };
    }
  };

  const [selectedWeek, setSelectedWeek] = useState(currentWeekNumber);
  const displayedDate = moment().isoWeek(selectedWeek);
  const displayedIsRemotePeriod =
    displayedDate.isSameOrAfter(remoteStart, "day") &&
    displayedDate.isBefore(remoteEnd, "day");

  const getDisplayedRotation = (date) => {
    if (displayedIsRemotePeriod) {
      const weeksSinceStart = date
        .clone()
        .startOf("isoWeek")
        .diff(remoteStart.clone().startOf("isoWeek"), "weeks");
      const index = weeksSinceStart % 3;
      const newRotation = remoteRotations[index];
      return {
        "Threat Hunter": newRotation[0],
        "Threat Hunter PT2": newRotation[1],
        "Tech Desk": newRotation[2],
        Remote: "Willis",
      };
    } else {
      const weekNum = date.isoWeek();
      const rotation = standardRotations[(weekNum - 1) % 4];
      return {
        "Threat Hunter": rotation[0],
        "Threat Hunter PT2": rotation[1],
        "Tech Desk": rotation[2],
        "Threat Intel (WFH Week)": rotation[3],
      };
    }
  };

  // Rotation for the currently selected week
  const displayedRotation = getDisplayedRotation(displayedDate);

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
        {
          role: "Threat Intel (WFH Week)",
          employee: displayedRotation["Threat Intel (WFH Week)"],
        },
      ];

  // Original code for the current week’s rotation, with a console.log so ESLint doesn’t complain
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
        {
          role: "Threat Intel (WFH Week)",
          employee: rotation["Threat Intel (WFH Week)"],
        },
      ];
  console.log("roleAssignments for current week:", roleAssignments);

  const handlePrevWeek = () => {
    setSelectedWeek((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) => prev + 1);
  };

  // Build the display text for the selected week
  const displayedWeekStart = displayedDate
    .clone()
    .startOf("isoWeek")
    .format("MMM D, YYYY");
  const displayedWeekEnd = displayedDate
    .clone()
    .endOf("isoWeek")
    .format("MMM D, YYYY");
  const displayedWeekLabel = `${displayedWeekStart} - ${displayedWeekEnd}`;

  return (
    <DashboardContainer>
      <Navbar />
      <Header />
      <MainContent>
        <LeftSection>
          {/* Container for the buttons and date range */}
          <WeekSelectorContainer>
            <ButtonGroup>
              <WeekButton onClick={handlePrevWeek}>Previous Week</WeekButton>
              <WeekButton onClick={handleNextWeek}>Next Week</WeekButton>
            </ButtonGroup>

            <WeekRangeText>{displayedWeekLabel}</WeekRangeText>
          </WeekSelectorContainer>

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
