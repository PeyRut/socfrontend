// src/components/CalendarView.js

import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './CalendarStyles.css'; // Import your CSS styles

// -------- Styled components --------
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
  color: var(--text-color);
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  max-width: 1600px;
`;

const Title = styled.h2`
  font-size: 2.3em;
  margin: 0;
`;

const BackButton = styled(Link)`
  background: var(--accent-color);
  color: var(--button-text-color);
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.95em;

  &:hover {
    background: var(--hover-accent);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 1600px;
`;

const DayName = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
  background: var(--secondary-background);
  border-radius: 4px;
  font-size: 1em;
`;

const DateCell = styled.div`
  background: var(--card-background);
  padding: 10px;
  min-height: 120px;
  border-radius: 4px;
  position: relative;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.9em;
`;

const RoleList = styled.div`
  margin-top: 5px;
`;

const RoleItem = styled.div`
  font-size: 0.85em;
  color: var(--role-text-color);
`;

// -------- Remote window definitions --------
const remoteStart = moment('2025-01-27', 'YYYY-MM-DD');
const remoteEnd = moment('2025-04-14', 'YYYY-MM-DD');

// -------- Standard (4-week) rotations --------
const standardRotations = [
  ['Willis', 'Jordan', 'Randy', 'Peyton'],
  ['Peyton', 'Willis', 'Jordan', 'Randy'],
  ['Randy', 'Peyton', 'Willis', 'Jordan'],
  ['Jordan', 'Randy', 'Peyton', 'Willis']
];

// -------- Remote (3-week) rotations --------
// Week 1: Peyton (TH), Jordan (TH PT2), Randy (Tech Desk)
// Week 2: Randy (TH), Peyton (TH PT2), Jordan (Tech Desk)
// Week 3: Jordan (TH), Randy (TH PT2), Peyton (Tech Desk)
const remoteRotations = [
  ['Peyton', 'Jordan', 'Randy'],
  ['Randy', 'Peyton', 'Jordan'],
  ['Jordan', 'Randy', 'Peyton']
];

/**
 * getRotationForDate: returns the correct rotation for a given date.
 *  - If in remote window, we anchor "Week 1" of remote to Monday, 1/27/2025.
 *  - Otherwise, we fall back to the 4-week standard rotation.
 */
const getRotationForDate = (date) => {
  const isRemotePeriod =
    date.isSameOrAfter(remoteStart, 'day') && date.isSameOrBefore(remoteEnd, 'day');

  if (isRemotePeriod) {
    // Find how many whole weeks since remoteStart's Monday
    const weeksSinceStart = date
      .clone()
      .startOf('isoWeek')
      .diff(remoteStart.clone().startOf('isoWeek'), 'weeks');

    // This yields 0 on week of 1/27, 1 the next Monday, etc.
    const index = weeksSinceStart % 3;
    const [th, th2, techDesk] = remoteRotations[index];

    return {
      'Threat Hunter': th,
      'Threat Hunter PT2': th2,
      'Tech Desk': techDesk,
      'Remote': 'Willis'
    };
  } else {
    // Use the original 4-week rotation outside the remote window
    const weekNumber = date.isoWeek();
    const s = standardRotations[(weekNumber - 1) % 4];
    return {
      'Threat Hunter': s[0],
      'Threat Hunter PT2': s[1],
      'Tech Desk': s[2],
      'Threat Intel': s[3]
    };
  }
};

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  // Map of company holidays (MM-DD)
  const company_holidays = {
    '01-01': "New Year's Day",
    '01-15': 'Martin Luther King Jr. Day',
    '02-19': "Presidents' Day",
    '05-27': 'Memorial Day',
    '06-19': 'Juneteenth',
    '07-04': 'Independence Day',
    '09-02': 'Labor Day',
    '11-28': 'Thanksgiving Day',
    '11-29': 'Day after Thanksgiving',
    '12-24': 'Christmas Eve',
    '12-25': 'Christmas Day',
    '12-31': "New Year's Eve"
  };

  // Generate the days for the current month in a grid (weeks)
  const generateCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const startDay = startOfMonth.day(); // Sunday=0, Monday=1, ...
    const totalDays = currentMonth.daysInMonth();

    // Adjust to start week on Monday
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const weeks = [];
    let week = [];

    // Fill empty cells before day 1
    for (let i = 0; i < adjustedStartDay; i++) {
      week.push(null);
    }

    // Fill actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Fill the trailing empty cells in the last row
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = generateCalendar();

  // Change to previous month
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.clone().subtract(1, 'months'));
  };

  // Change to next month
  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.clone().add(1, 'months'));
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

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            if (day === null) {
              return <DateCell key={`${weekIndex}-${dayIndex}`} />;
            }

            const date = currentMonth.clone().date(day);
            const holidayLabel = company_holidays[date.format('MM-DD')];

            // Get rotation for this particular day
            const rotation = getRotationForDate(date);

            return (
              <DateCell key={`${weekIndex}-${dayIndex}`}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  {day}
                </div>
                <RoleList>
                  {Object.entries(rotation).map(([role, employee], idx) => (
                    <RoleItem key={idx}>
                      {role}: {employee}
                    </RoleItem>
                  ))}
                </RoleList>
                {holidayLabel && <HolidayLabel>{holidayLabel}</HolidayLabel>}
              </DateCell>
            );
          })
        )}
      </CalendarGrid>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          width: '100%',
          maxWidth: '1600px'
        }}
      >
        <button onClick={handlePrevMonth} style={buttonStyle}>
          Previous Month
        </button>
        <button onClick={handleNextMonth} style={buttonStyle}>
          Next Month
        </button>
      </div>
    </CalendarContainer>
  );
};

// Basic button styling
const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: 'var(--accent-color)',
  color: 'var(--button-text-color)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1em'
};

export default CalendarView;
