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

const WeekSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
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
        { role: "Threat Intel (WFH Week)", employee: displayedRotation["Threat Intel (WFH Week)"] },
      ];

  /* eslint-disable no-unused-vars */
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
  /* eslint-enable no-unused-vars */

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
          <WeekSelector>
            <WeekButton onClick={handlePrevWeek}>Previous Week</WeekButton>
            <WeekButton onClick={handleNextWeek}>Next Week</WeekButton>
          </WeekSelector>
          <RolesSection>
            {displayedRoleAssignments.map((assignment, index) => (
              <RoleCard key={index} role={assignment.role} employee={assignment.employee} />
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
