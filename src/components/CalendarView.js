// src/components/CalendarView.js

import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './CalendarStyles.css'; // Import the CSS styles

// Define HolidayLabel once outside the component
const HolidayLabel = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: var(--holiday-background);
  color: var(--background-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  text-align: center;
`;

const CalendarContainer = styled.div`
  /* Inherit global dark background */
  color: var(--text-color);
  padding: 10px; /* Reduced padding */
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center the calendar vertically */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px; /* Slightly reduced margin */
  width: 100%;
  max-width: 1600px; /* Increased max-width for wider calendar */
`;

const Title = styled.h2`
  font-size: 2.3em; /* Slightly reduced font size */
  margin: 0;
`;

const BackButton = styled(Link)`
  background: var(--accent-color);
  color: var(--button-text-color);
  padding: 10px 20px; /* Reduced padding */
  border-radius: 6px; /* Reduced border-radius */
  text-decoration: none;
  font-size: 0.95em; /* Slightly reduced font size */

  &:hover {
    background: var(--hover-accent);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px; /* Reduced gap */
  width: 100%;
  max-width: 1600px; /* Increased max-width to match Header */
`;

const DayName = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 10px 0; /* Reduced padding */
  background: var(--secondary-background);
  border-radius: 4px;
  font-size: 1em; /* Slightly reduced font size */
`;

const DateCell = styled.div`
  background: var(--card-background);
  padding: 10px; /* Reduced padding */
  min-height: 120px; /* Reduced min-height for smaller height */
  border-radius: 4px;
  position: relative;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.9em; /* Slightly reduced font size */
`;

const RoleList = styled.div`
  margin-top: 5px;
`;

const RoleItem = styled.div`
  font-size: 0.85em; /* Slightly reduced font size */
  color: var(--role-text-color);
`;

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const company_holidays = {
    "01-01": "New Year's Day",
    "01-15": "Martin Luther King Jr. Day",
    "02-19": "Presidents' Day",
    "05-27": "Memorial Day",
    "06-19": "Juneteenth",
    "07-04": "Independence Day",
    "09-02": "Labor Day",
    "11-28": "Thanksgiving Day",
    "11-29": "Day after Thanksgiving",
    "12-24": "Christmas Eve",
    "12-25": "Christmas Day",
    "12-31": "New Year's Eve"
  };

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
      "Tech Desk": rotation[2],
      "Threat Intel (WFH Week)": rotation[3]
    };
  };

  const generateCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const startDay = startOfMonth.day(); // 0 (Sunday) - 6 (Saturday)
    const totalDays = currentMonth.daysInMonth();

    // Adjusting to start the week on Monday
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const weeks = [];
    let week = [];

    // Fill empty cells for days before the first of the month
    for (let i = 0; i < adjustedStartDay; i++) {
      week.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Fill the remaining cells of the last week
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = generateCalendar();

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'months'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'months'));
  };

  return (
    <CalendarContainer>
      <Header>
        <Title>{currentMonth.format('MMMM YYYY')}</Title>
        <BackButton to="/">Back to Dashboard</BackButton>
      </Header>
      <CalendarGrid>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <DayName key={index}>{day}</DayName>
        ))}
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => {
            if (day === null) {
              return <DateCell key={`${weekIndex}-${dayIndex}`} />;
            } else {
              const date = moment(currentMonth).date(day);
              const weekNumber = date.isoWeek();
              const dateKey = date.format('MM-DD');
              const holiday = company_holidays[dateKey];
              const rotation = getRotation(weekNumber);

              return (
                <DateCell key={`${weekIndex}-${dayIndex}`}>
                  <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{day}</div>
                  {/* Display roles */}
                  <RoleList>
                    {Object.entries(rotation).map(([role, employee], idx) => (
                      <RoleItem key={idx}>
                        {role}: {employee}
                      </RoleItem>
                    ))}
                  </RoleList>
                  {/* Display holiday if exists */}
                  {holiday && <HolidayLabel>{holiday}</HolidayLabel>}
                </DateCell>
              );
            }
          })
        ))}
      </CalendarGrid>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', width: '100%', maxWidth: '1600px' }}>
        <button onClick={handlePrevMonth} style={buttonStyle}>Previous Month</button>
        <button onClick={handleNextMonth} style={buttonStyle}>Next Month</button>
      </div>
    </CalendarContainer>
  );
};

// Button styling
const buttonStyle = {
  padding: '12px 24px', // Increased padding
  backgroundColor: 'var(--accent-color)',
  color: 'var(--button-text-color)',
  border: 'none',
  borderRadius: '8px', // Increased border-radius
  cursor: 'pointer',
  fontSize: '1em' // Increased font size
};

export default CalendarView;
