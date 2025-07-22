// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';

import { ReactComponent as RaindropsIcon } from '../assets/weather-icons/raindrops.svg';
import { ReactComponent as WindIcon } from '../assets/weather-icons/wind.svg';

const OverviewContainer = styled.div`
  background: var(--secondary-background);
  color: var(--text-color);
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const OverviewHeader = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  color: var(--accent-color);
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  overflow: hidden;
`;

const ForecastCard = styled.div`
  background: var(--card-background);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const WeatherIconContainer = styled.div`
  margin-bottom: 10px;
`;

const Day = styled.div`
  font-size: 1.1em;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--accent-color);
`;

const Temperature = styled.div`
  font-size: 1em;
  margin: 8px 0;
  font-weight: bold;
  color: var(--text-color);
`;

const Description = styled.div`
  font-size: 0.95em;
  margin-top: 5px;
  color: var(--accent-color);
  font-style: italic;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9em;
  margin-bottom: 5px;
  color: var(--primary-color);
  justify-content: center;
`;

const InfoIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 5px;

  svg {
    width: 100%;
    height: 100%;
    fill: white;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid var(--accent-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 2s linear infinite;
  margin: 0 auto;
`;

const WeatherOverview = () => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const apiKey = '1ad2758f791944fbab3143417252207';
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Allen,TX&days=7&aqi=no&alerts=no`;

        const response = await axios.get(url, { timeout: 10000 });

        if (!response.data || !response.data.forecast?.forecastday) {
          throw new Error('Invalid data structure in WeatherAPI response');
        }

        const forecastData = response.data.forecast.forecastday.map(day => ({
          date: day.date,
          maxTemp: day.day.maxtemp_f,
          minTemp: day.day.mintemp_f,
          precipitationProbability: day.day.daily_chance_of_rain,
          windSpeed: day.day.maxwind_mph,
          weatherDescription: day.day.condition.text,
          weatherIconUrl: `https:${day.day.condition.icon}`
        }));

        setForecast(forecastData);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
        setError('Failed to fetch weather data. Please try again later.');
      }
    };

    fetchForecast();
  }, []);

  if (error) {
    return (
      <OverviewContainer>
        <OverviewHeader>Weather Overview</OverviewHeader>
        <p>{error}</p>
        <p>Please try refreshing the page or check back later.</p>
      </OverviewContainer>
    );
  }

  if (forecast.length === 0) {
    return (
      <OverviewContainer>
        <OverviewHeader>Weather Overview</OverviewHeader>
        <Spinner />
        <p>Loading weather data...</p>
      </OverviewContainer>
    );
  }

  return (
    <OverviewContainer>
      <OverviewHeader>7-Day Weather Forecast for Allen, TX</OverviewHeader>
      <ForecastGrid>
        {forecast.map((day, index) => (
          <ForecastCard key={index}>
            <Day>{moment(day.date).format('ddd, MMM D')}</Day>
            <WeatherIconContainer>
              <img
                src={day.weatherIconUrl}
                alt={day.weatherDescription}
                style={{ width: '64px', height: '64px' }}
              />
            </WeatherIconContainer>
            <Temperature>
              High: {Math.round(day.maxTemp)}°F
              <br />
              Low: {Math.round(day.minTemp)}°F
            </Temperature>
            <InfoRow>
              <InfoIcon>
                <RaindropsIcon aria-label="Precipitation" />
              </InfoIcon>
              {day.precipitationProbability !== null
                ? `${day.precipitationProbability}%`
                : 'N/A'}
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <WindIcon aria-label="Wind Speed" />
              </InfoIcon>
              {day.windSpeed !== null
                ? `${Math.round(day.windSpeed)} mph`
                : 'N/A'}
            </InfoRow>
            <Description>{day.weatherDescription}</Description>
          </ForecastCard>
        ))}
      </ForecastGrid>
    </OverviewContainer>
  );
};

export default WeatherOverview;
