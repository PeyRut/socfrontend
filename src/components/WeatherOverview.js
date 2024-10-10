// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiShowers,
} from 'react-icons/wi';

const OverviewContainer = styled.div`
  background: var(--secondary-background);
  color: var(--text-color);
  border-radius: 16px;
  padding: 30px;
  margin-top: 40px;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const OverviewHeader = styled.h2`
  font-size: 2.5em;
  margin-bottom: 30px;
  text-align: center;
  color: var(--accent-color);
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
  overflow: hidden;
`;

const ForecastCard = styled.div`
  background: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  }
`;

const WeatherIconContainer = styled.div`
  margin-bottom: 15px;
  font-size: 3.5em;
`;

const Day = styled.div`
  font-size: 1.4em;
  margin-bottom: 15px;
  font-weight: bold;
  color: var(--accent-color);
`;

const Temperature = styled.div`
  font-size: 1.1em;
  margin: 10px 0;
`;

const Precipitation = styled.div`
  font-size: 1em;
  margin: 10px 0;
  color: var(--primary-color);
`;

const WindSpeed = styled.div`
  font-size: 1em;
  margin: 10px 0;
  color: var(--primary-color);
`;

const Description = styled.div`
  font-size: 1em;
  margin-top: 10px;
  color: var(--accent-color);
  font-weight: bold;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid var(--accent-color);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
  margin: 0 auto;
`;

// Updated mapping for weather codes to React Icons from Wi
const weatherCodeMap = {
  0: { description: 'Clear sky', icon: WiDaySunny, color: '#f39c12' },
  1: { description: 'Mainly clear', icon: WiDaySunny, color: '#f39c12' },
  2: { description: 'Partly cloudy', icon: WiDayCloudy, color: '#f1c40f' },
  3: { description: 'Overcast', icon: WiCloudy, color: '#95a5a6' },
  45: { description: 'Fog', icon: WiFog, color: '#95a5a6' },
  48: { description: 'Depositing rime fog', icon: WiFog, color: '#95a5a6' },
  51: { description: 'Light drizzle', icon: WiShowers, color: '#3498db' },
  53: { description: 'Moderate drizzle', icon: WiShowers, color: '#3498db' },
  55: { description: 'Dense drizzle', icon: WiRain, color: '#2980b9' },
  61: { description: 'Slight rain', icon: WiDayCloudy, color: '#3498db' },
  63: { description: 'Moderate rain', icon: WiRain, color: '#2980b9' },
  65: { description: 'Heavy rain', icon: WiShowers, color: '#2980b9' },
  66: { description: 'Light freezing rain', icon: WiRain, color: '#2980b9' },
  67: { description: 'Heavy freezing rain', icon: WiShowers, color: '#2980b9' },
  71: { description: 'Slight snow fall', icon: WiSnow, color: '#ecf0f1' },
  73: { description: 'Moderate snow fall', icon: WiSnow, color: '#ecf0f1' },
  75: { description: 'Heavy snow fall', icon: WiSnow, color: '#ecf0f1' },
  77: { description: 'Snow grains', icon: WiSnow, color: '#ecf0f1' },
  80: { description: 'Slight rain showers', icon: WiShowers, color: '#3498db' },
  81: { description: 'Moderate rain showers', icon: WiShowers, color: '#2980b9' },
  82: { description: 'Violent rain showers', icon: WiShowers, color: '#2980b9' },
  85: { description: 'Slight snow showers', icon: WiSnow, color: '#ecf0f1' },
  86: { description: 'Heavy snow showers', icon: WiSnow, color: '#ecf0f1' },
  95: { description: 'Thunderstorm', icon: WiThunderstorm, color: '#9b59b6' },
  96: { description: 'Thunderstorm with slight hail', icon: WiThunderstorm, color: '#9b59b6' },
  99: { description: 'Thunderstorm with heavy hail', icon: WiThunderstorm, color: '#8e44ad' },
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
                'windspeed_10m_max',
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
          windSpeed: dailyData.windspeed_10m_max
            ? `${dailyData.windspeed_10m_max[index]} mph`
            : 'N/A',
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
            icon: WiDaySunny,
            color: '#7f8c8d',
          };
          const IconComponent = weatherInfo.icon;

          return (
            <ForecastCard key={index}>
              <Day>{date.format('ddd, MMM D')}</Day>
              <WeatherIconContainer>
                <IconComponent color={weatherInfo.color} />
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
              <WindSpeed>
                Wind Speed: {day.windSpeed}
              </WindSpeed>
              <Description>{weatherInfo.description}</Description>
            </ForecastCard>
          );
        })}
      </ForecastGrid>
    </OverviewContainer>
  );
};

export default WeatherOverview;
