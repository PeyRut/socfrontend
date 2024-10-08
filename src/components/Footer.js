// src/components/Footer.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const FooterContainer = styled.footer`
  background-color: var(--secondary-background);
  color: #ffffff;
  text-align: center;
  padding: 15px;
  border-top: 1px solid #444;
`;

const TimeDisplay = styled.div`
  font-size: 0.9em;
`;

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  const nextUpdateTime = moment().add(1, 'weeks').startOf('isoWeek');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <FooterContainer>
      <TimeDisplay>
        Current Time: {currentTime.format('MMMM D, YYYY hh:mm A')} | Next Rotation Update:{' '}
        {nextUpdateTime.format('MMMM D, YYYY')}
      </TimeDisplay>
    </FooterContainer>
  );
};

export default Footer;
