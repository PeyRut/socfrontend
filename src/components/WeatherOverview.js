// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';

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

const Precipitation = styled.div`
  font-size: 0.9em;
  margin-bottom: 5px;
  color: var(--primary-color);
`;

const Description = styled.div`
  font-size: 0.95em;
  margin-top: 5px;
  color: var(--accent-color);
  font-style: italic;
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

// Updated mapping for weather codes to icon file paths
const weatherCodeMap = {
  0: { description: 'Clear sky', icon: 'clear-day.svg' },
  1: { description: 'Mainly clear', icon: 'clear-day.svg' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy-day.svg' },
  3: { description: 'Overcast', icon: 'cloudy.svg' },
  45: { description: 'Fog', icon: 'fog.svg' },
  48: { description: 'Depositing rime fog', icon: 'fog.svg' },
  51: { description: 'Light drizzle', icon: 'drizzle.svg' },
  53: { description: 'Moderate drizzle', icon: 'drizzle.svg' },
  55: { description: 'Dense drizzle', icon: 'rain.svg' },
  61: { description: 'Slight rain', icon: 'rain.svg' },
  63: { description: 'Moderate rain', icon: 'rain.svg' },
  65: { description: 'Heavy rain', icon: 'rain.svg' },
  66: { description: 'Light freezing rain', icon: 'sleet.svg' },
  67: { description: 'Heavy freezing rain', icon: 'sleet.svg' },
  71: { description: 'Slight snow fall', icon: 'snow.svg' },
  73: { description: 'Moderate snow fall', icon: 'snow.svg' },
  75: { description: 'Heavy snow fall', icon: 'snow.svg' },
  77: { description: 'Snow grains', icon: 'snow.svg' },
  80: { description: 'Slight rain showers', icon: 'rain.svg' },
  81: { description: 'Moderate rain showers', icon: 'rain.svg' },
  82: { description: 'Violent rain showers', icon: 'rain.svg' },
  85: { description: 'Slight snow showers', icon: 'snow.svg' },
  86: { description: 'Heavy snow showers', icon: 'snow.svg' },
  95: { description: 'Thunderstorm', icon: 'thunderstorms-rain.svg' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorms-rain.svg' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorms-rain.svg' },
};

const WeatherOverview = () => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/weather`,
          {
            params: {
              latitude: 33.1032,
              longitude: -96.6706,
              daily: [
                'temperature_2m_max',
                'temperature_2m_min',
                'weathercode',
                'precipitation_probability_max',
              ],
              timezone: 'America/Chicago',
            },
          }
        );

        const dailyData = response.data.daily;

        if (!dailyData || !dailyData.time) {
          throw new Error('Invalid daily data structure in API response.');
        }

        const forecastData = dailyData.time.map((date, index) => ({
          date,
          maxTemp: dailyData.temperature_2m_max
            ? dailyData.temperature_2m_max[index]
            : null,
          minTemp: dailyData.temperature_2m_min
            ? dailyData.temperature_2m_min[index]
            : null,
          weatherCode: dailyData.weathercode
            ? dailyData.weathercode[index]
            : null,
          precipitationProbability: dailyData.precipitation_probability_max
            ? dailyData.precipitation_probability_max[index]
            : null,
        }));
        setForecast(forecastData);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
        setError('Failed to fetch weather data.');
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
        {forecast.map((day, index) => {
          if (!day) return null;
          const date = moment(day.date);
          const weatherInfo = weatherCodeMap[day.weatherCode] || {
            description: 'Unknown',
            icon: 'clear-day.svg',
          };

          return (
            <ForecastCard key={index}>
              <Day>{date.format('ddd, MMM D')}</Day>
              <WeatherIconContainer>
                <img
                  src={require(`../assets/weather-icons/${weatherInfo.icon}`)}
                  alt={weatherInfo.description}
                  style={{ width: '64px', height: '64px' }}
                />
              </WeatherIconContainer>
              <Temperature>
                High: {day.maxTemp !== null ? `${Math.round(day.maxTemp)}°F` : 'N/A'}
                <br />
                Low: {day.minTemp !== null ? `${Math.round(day.minTemp)}°F` : 'N/A'}
              </Temperature>
              <Precipitation>
                Precipitation: {day.precipitationProbability !== null
                  ? `${day.precipitationProbability}%`
                  : 'N/A'}
              </Precipitation>
              <Description>{weatherInfo.description}</Description>
            </ForecastCard>
          );
        })}
      </ForecastGrid>
    </OverviewContainer>
  );
};

export default WeatherOverview;
