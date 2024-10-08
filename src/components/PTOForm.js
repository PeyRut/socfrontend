// src/components/PTOForm.js

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // You may need to install this dependency

import 'react-datepicker/dist/react-datepicker.css';

// Styled components
const PTOFormContainer = styled.div`
  background: var(--secondary-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
`;

const Title = styled.h3`
  color: var(--accent-color);
  margin-bottom: 15px;
  text-align: center;
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
  color: var(--text-color);
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--accent-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
`;

const PTOForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [replacement, setReplacement] = useState('');
  const [teamMembers] = useState(['Willis', 'Jordan', 'Randy', 'Peyton']);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replacement) {
      setMessage('Please select a replacement.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/pto`, {
        startDate,
        endDate,
        replacement,
      });
      setMessage('PTO request submitted successfully!');
    } catch (error) {
      console.error('Error submitting PTO request:', error);
      setMessage('Failed to submit PTO request.');
    }
  };

  return (
    <PTOFormContainer>
      <Title>Submit PTO Request</Title>
      <form onSubmit={handleSubmit}>
        <Label>Start Date</Label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <Label>End Date</Label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        <Label>Replacement</Label>
        <Select value={replacement} onChange={(e) => setReplacement(e.target.value)}>
          <option value="">Select a replacement...</option>
          {teamMembers.filter(member => member !== 'Peyton').map((member) => (
            <option key={member} value={member}>{member}</option>
          ))}
        </Select>
        <SubmitButton type="submit">Submit PTO Request</SubmitButton>
        {message && <p>{message}</p>}
      </form>
    </PTOFormContainer>
  );
};

export default PTOForm;
