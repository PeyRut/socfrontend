// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';

const OverviewContainer = styled.div`
  /* ... (same as before) */
`;

const OverviewHeader = styled.h2`
  /* ... (same as before) */
`;

const ForecastGrid = styled.div`
  /* ... (same as before) */
`;

const ForecastCard = styled.div`
  /* ... (same as before) */
`;

const WeatherIconContainer = styled.div`
  /* ... (same as before) */
`;

const Day = styled.div`
  /* ... (same as before) */
`;

const Temperature = styled.div`
  /* ... (same as before) */
`;

const Precipitation = styled.div`
  /* ... (same as before) */
`;

const WindSpeed = styled.div`
  font-size: 0.9em;
  margin-bottom: 5px;
  color: var(--primary-color);
`;

const Description = styled.div`
  /* ... (same as before) */
`;

const spin = keyframes`
  /* ... (same as before) */
`;

const Spinner = styled.div`
  /* ... (same as before) */
`;

// Complete mapping for weather codes to icon file paths
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
  56: { description: 'Light freezing drizzle', icon: 'sleet.svg' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet.svg' },
  61: { description: 'Slight rain', icon: 'rain.svg' },
  63: { description: 'Moderate rain', icon: 'rain.svg' },
  65: { description: 'Heavy rain', icon: 'rain.svg' },
  66: { description: 'Light freezing rain', icon: 'sleet.svg' },
  67: { description: 'Heavy freezing rain', icon: 'sleet.svg' },
  71: { description: 'Slight snowfall', icon: 'snow.svg' },
  73: { description: 'Moderate snowfall', icon: 'snow.svg' },
  75: { description: 'Heavy snowfall', icon: 'snow.svg' },
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
                'windspeed_10m_max', // Corrected parameter name
              ],
              timezone: 'America/Chicago',
              windspeed_unit: 'mph', // Corrected parameter name
            },
          }
        );

        const dailyData = response.data.daily;

        // Debugging: Log daily data
        console.log('Daily Data:', dailyData);

        if (!dailyData || !dailyData.time) {
          throw new Error('Invalid daily data structure in API response.');
        }

        const forecastData = dailyData.time.map((date, index) => {
          // Convert weather code to integer to match the keys in weatherCodeMap
          const weatherCode = dailyData.weathercode
            ? parseInt(dailyData.weathercode[index], 10)
            : null;

          // Debugging: Log weather code
          console.log(`Weather code for ${date}:`, weatherCode);

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
            windSpeed: dailyData.windspeed_10m_max
              ? dailyData.windspeed_10m_max[index]
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
          const weatherInfo = weatherCodeMap[day.weatherCode];

          // Debugging: Log weather info
          console.log(`Weather info for ${date.format('YYYY-MM-DD')}:`, weatherInfo);

          return (
            <ForecastCard key={index}>
              <Day>{date.format('ddd, MMM D')}</Day>
              <WeatherIconContainer>
                <img
                  src={require(`../assets/weather-icons/${
                    weatherInfo ? weatherInfo.icon : 'clear-day.svg'
                  }`)}
                  alt={weatherInfo ? weatherInfo.description : 'Unknown'}
                  style={{ width: '64px', height: '64px' }}
                />
              </WeatherIconContainer>
              <Temperature>
                High: {day.maxTemp !== null ? `${Math.round(day.maxTemp)}°F` : 'N/A'}
                <br />
                Low: {day.minTemp !== null ? `${Math.round(day.minTemp)}°F` : 'N/A'}
              </Temperature>
              <Precipitation>
                Precipitation:{' '}
                {day.precipitationProbability !== null
                  ? `${day.precipitationProbability}%`
                  : 'N/A'}
              </Precipitation>
              <WindSpeed>
                Wind Speed:{' '}
                {day.windSpeed !== null ? `${Math.round(day.windSpeed)} mph` : 'N/A'}
              </WindSpeed>
              <Description>
                {weatherInfo ? weatherInfo.description : 'Unknown'}
              </Description>
            </ForecastCard>
          );
        })}
      </ForecastGrid>
    </OverviewContainer>
  );
};

export default WeatherOverview;
