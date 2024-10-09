// src/components/WeatherOverview.js

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import { Player } from '@lottiefiles/react-lottie-player';

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

const WeatherIconContainer = styled.div`
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

// Mapping weather codes from Open-Meteo to Lottie animation URLs
const weatherCodeMap = {
  0: {
    description: 'Clear sky',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_4klv9rbm.json',
  },
  1: {
    description: 'Mainly clear',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_4klv9rbm.json',
  },
  2: {
    description: 'Partly cloudy',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_8lg6m6.json',
  },
  3: {
    description: 'Overcast',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_dgjue3xo.json',
  },
  45: {
    description: 'Fog',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_foggy.json',
  },
  48: {
    description: 'Depositing rime fog',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_foggy.json',
  },
  51: {
    description: 'Light drizzle',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_rainy.json',
  },
  61: {
    description: 'Slight rain',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_rainy.json',
  },
  71: {
    description: 'Slight snow fall',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_snowy.json',
  },
  80: {
    description: 'Rain showers',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_rainy.json',
  },
  95: {
    description: 'Thunderstorm',
    animationUrl: 'https://assets8.lottiefiles.com/packages/lf20_stormy.json',
  },
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
            ? dailyData.windspeed_10m_max[index]
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
            animationUrl:
              'https://assets6.lottiefiles.com/packages/lf20_4klv9rbm.json',
          };

          return (
            <ForecastCard key={index}>
              <Day>{date.format('ddd, MMM D')}</Day>
              <WeatherIconContainer>
                <Player
                  autoplay
                  loop
                  src={weatherInfo.animationUrl}
                  style={{ height: '100px', width: '100px' }}
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
              <WindSpeed>
                Wind Speed: {day.windSpeed !== null ? `${day.windSpeed} mph` : 'N/A'}
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
