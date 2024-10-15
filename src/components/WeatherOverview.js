// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';

// Import the SVG icons as React components
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
    fill: white; /* Set SVG fill color to white */
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

// Updated mapping for weather codes to icon file paths
const weatherCodeMap = {
  // Clear sky
  0: { description: 'Clear sky', icon: 'clear-day.svg' },

  // Mainly clear, partly cloudy, and overcast
  1: { description: 'Mainly clear', icon: 'clear-day.svg' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy-day.svg' },
  3: { description: 'Overcast', icon: 'cloudy.svg' },

  // Fog and depositing rime fog
  45: { description: 'Fog', icon: 'fog.svg' },
  48: { description: 'Depositing rime fog', icon: 'fog.svg' },

  // Drizzle: Light, moderate, and dense intensity
  51: { description: 'Light drizzle', icon: 'drizzle.svg' },
  53: { description: 'Moderate drizzle', icon: 'drizzle.svg' },
  55: { description: 'Dense drizzle', icon: 'drizzle.svg' },

  // Freezing Drizzle: Light and dense intensity
  56: { description: 'Light freezing drizzle', icon: 'sleet.svg' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet.svg' },

  // Rain: Slight, moderate and heavy intensity
  61: { description: 'Slight rain', icon: 'rain.svg' },
  63: { description: 'Moderate rain', icon: 'rain.svg' },
  65: { description: 'Heavy rain', icon: 'rain.svg' },

  // Freezing Rain: Light and heavy intensity
  66: { description: 'Light freezing rain', icon: 'sleet.svg' },
  67: { description: 'Heavy freezing rain', icon: 'sleet.svg' },

  // Snow fall: Slight, moderate, and heavy intensity
  71: { description: 'Slight snowfall', icon: 'snow.svg' },
  73: { description: 'Moderate snowfall', icon: 'snow.svg' },
  75: { description: 'Heavy snowfall', icon: 'snow.svg' },

  // Snow grains
  77: { description: 'Snow grains', icon: 'snow.svg' },

  // Rain showers: Slight, moderate, and violent
  80: { description: 'Slight rain showers', icon: 'rain.svg' },
  81: { description: 'Moderate rain showers', icon: 'rain.svg' },
  82: { description: 'Violent rain showers', icon: 'rain.svg' },

  // Snow showers slight and heavy
  85: { description: 'Slight snow showers', icon: 'snow-showers.svg' },
  86: { description: 'Heavy snow showers', icon: 'snow-showers.svg' },

  // Thunderstorm: Slight or moderate
  95: { description: 'Thunderstorm', icon: 'thunderstorms.svg' },

  // Thunderstorm with slight and heavy hail
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
          'https://api.open-meteo.com/v1/forecast',
          {
            params: {
              latitude: 33.1032,
              longitude: -96.6706,
              daily: [
                'temperature_2m_max',
                'temperature_2m_min',
                'weathercode',
                'precipitation_probability_max',
                'wind_speed_10m_max',
              ],
              timezone: 'America/Chicago',
              wind_speed_unit: 'mph',
              temperature_unit: 'fahrenheit',
            },
          }
        );

        const dailyData = response.data.daily;

        if (!dailyData || !dailyData.time) {
          throw new Error('Invalid daily data structure in API response.');
        }

        const forecastData = dailyData.time.map((date, index) => {
          const weatherCode = dailyData.weathercode
            ? parseInt(dailyData.weathercode[index], 10)
            : null;

          return {
            date,
            maxTemp: dailyData.temperature_2m_max
              ? dailyData.temperature_2m_max[index]
              : null,
            minTemp: dailyData.temperature_2m_min
              ? dailyData.temperature_2m_min[index]
              : null,
            weatherCode,
            precipitationProbability: dailyData.precipitation_probability_max
              ? dailyData.precipitation_probability_max[index]
              : null,
            windSpeed: dailyData.wind_speed_10m_max
              ? dailyData.wind_speed_10m_max[index]
              : null,
          };
        });
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
            description: `Unknown weather code: ${day.weatherCode}`,
            icon: 'unknown.svg',
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
              <Description>{weatherInfo.description}</Description>
            </ForecastCard>
          );
        })}
      </ForecastGrid>
    </OverviewContainer>
  );
};

export default WeatherOverview;
