// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import ReactAnimatedWeather from 'react-animated-weather';

const OverviewContainer = styled.div`
  background: var(--secondary-background);
  color: var(--text-color);
  border-radius: 16px;
  padding: 30px;
  margin-top: 40px;
  width: 100%;
  max-width: 1200px;
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
  gap: 15px;
  overflow: hidden;
`;

const ForecastCard = styled.div`
  background: var(--card-background);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
  }
`;

const WeatherIcon = styled.div`
  font-size: 3em;
  margin-bottom: 10px;
`;

const Day = styled.div`
  font-size: 1.2em;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Temperature = styled.div`
  font-size: 1em;
  margin-top: 5px;
`;

const Precipitation = styled.div`
  font-size: 0.9em;
  margin-top: 5px;
  color: var(--accent-color);
`;

const WindSpeed = styled.div`
  font-size: 0.9em;
  margin-top: 5px;
  color: var(--accent-color);
`;

const Description = styled.div`
  font-size: 0.9em;
  margin-top: 5px;
  color: var(--accent-color);
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

const weatherCodeMap = {
  0: { description: 'Clear sky', iconType: 'CLEAR_DAY' },
  1: { description: 'Mainly clear', iconType: 'CLEAR_DAY' },
  2: { description: 'Partly cloudy', iconType: 'PARTLY_CLOUDY_DAY' },
  3: { description: 'Overcast', iconType: 'CLOUDY' },
  45: { description: 'Fog', iconType: 'FOG' },
  48: { description: 'Depositing rime fog', iconType: 'FOG' },
  51: { description: 'Light drizzle', iconType: 'RAIN' },
  53: { description: 'Moderate drizzle', iconType: 'RAIN' },
  55: { description: 'Dense drizzle', iconType: 'RAIN' },
  56: { description: 'Light freezing drizzle', iconType: 'SLEET' },
  57: { description: 'Dense freezing drizzle', iconType: 'SLEET' },
  61: { description: 'Slight rain', iconType: 'RAIN' },
  63: { description: 'Moderate rain', iconType: 'RAIN' },
  65: { description: 'Heavy rain', iconType: 'RAIN' },
  66: { description: 'Light freezing rain', iconType: 'SLEET' },
  67: { description: 'Heavy freezing rain', iconType: 'SLEET' },
  71: { description: 'Slight snow fall', iconType: 'SNOW' },
  73: { description: 'Moderate snow fall', iconType: 'SNOW' },
  75: { description: 'Heavy snow fall', iconType: 'SNOW' },
  77: { description: 'Snow grains', iconType: 'SNOW' },
  80: { description: 'Slight rain showers', iconType: 'RAIN' },
  81: { description: 'Moderate rain showers', iconType: 'RAIN' },
  82: { description: 'Violent rain showers', iconType: 'RAIN' },
  85: { description: 'Slight snow showers', iconType: 'SNOW' },
  86: { description: 'Heavy snow showers', iconType: 'SNOW' },
  95: { description: 'Thunderstorm', iconType: 'RAIN' },
  96: { description: 'Thunderstorm with slight hail', iconType: 'SLEET' },
  99: { description: 'Thunderstorm with heavy hail', iconType: 'SLEET' },
};

const WeatherOverview = () => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/weather`);
        const dailyData = response.data.daily;
        const forecastData = dailyData.time.map((date, index) => ({
          date,
          maxTemp: dailyData.temperature_2m_max[index],
          minTemp: dailyData.temperature_2m_min[index],
          weatherCode: dailyData.weathercode[index],
          precipitationProbability: dailyData.precipitation_probability_max[index],
          windSpeed: dailyData.windspeed_10m_max[index], // Add wind speed data here
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
          const date = moment(day.date);
          const weatherInfo = weatherCodeMap[day.weatherCode] || {
            description: 'Unknown',
            iconType: 'CLEAR_DAY',
          };
          return (
            <ForecastCard key={index}>
              <Day>{date.format('ddd, MMM D')}</Day>
              <WeatherIcon>
                <ReactAnimatedWeather
                  icon={weatherInfo.iconType}
                  color="goldenrod"
                  size={64}
                  animate={true}
                />
              </WeatherIcon>
              <Temperature>
                High: {Math.round(day.maxTemp)}°F<br />
                Low: {Math.round(day.minTemp)}°F
              </Temperature>
              <Precipitation>
                Precipitation: {day.precipitationProbability}%
              </Precipitation>
              <WindSpeed>
                Wind Speed: {day.windSpeed ? `${day.windSpeed} mph` : 'N/A'}
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
