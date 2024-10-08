// src/components/Header.js

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const HeaderContainer = styled.header`
  text-align: center;
  padding: 40px 20px 20px;
  color: var(--text-color);
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 10px;
  font-weight: 700;
  color: var(--accent-color);
`;

const SubHeader = styled.div`
  font-size: 1.2em;
  color: var(--accent-color);
`;

const Header = () => {
  // Company holidays
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

  // Calculate the current week range using ISO week
  const currentDate = moment();
  const currentWeekNumber = currentDate.isoWeek();
  const weekStart = currentDate.clone().startOf('isoWeek').format('MMMM D');
  const weekEnd = currentDate.clone().endOf('isoWeek').format('MMMM D, YYYY');
  const weekRange = `Week ${currentWeekNumber}: ${weekStart} - ${weekEnd}`;

  // Define upcoming holidays
  const holidays = Object.keys(company_holidays).map(date => {
    const [month, day] = date.split('-').map(num => parseInt(num, 10));
    return {
      date: moment({ year: currentDate.year(), month: month - 1, day }),
      name: company_holidays[date]
    };
  });

  // Find the next holiday
  const nextHoliday = holidays.find(holiday => holiday.date.isSameOrAfter(currentDate, 'day'));
  const holidayNotice = nextHoliday
    ? `Next Holiday: ${nextHoliday.name} on ${nextHoliday.date.format('MMMM D, YYYY')}`
    : 'No upcoming holidays this year';

  return (
    <HeaderContainer>
      <Title>BeyondID SOC Rotation Dashboard</Title>
      <SubHeader>{weekRange}</SubHeader>
      <SubHeader>{holidayNotice}</SubHeader>
    </HeaderContainer>
  );
};

export default Header;
