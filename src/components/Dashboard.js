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

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 2vw; /* Adjust padding using relative units */
  box-sizing: border-box;
  width: 100%;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column; /* Stack sections vertically on smaller screens */
  }
`;

const LeftSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vw; /* Adjust gap using relative units */
  width: 100%;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  margin-left: 2vw;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const RolesSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2vw;
  width: 100%;
`;

const Dashboard = () => {
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

  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();
  const rotation = getRotation(currentWeekNumber);

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
