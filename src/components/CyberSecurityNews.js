// src/components/CyberSecurityNews.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const NewsContainer = styled.div`
  background: var(--card-background);
  color: var(--text-color);
  border-radius: 12px;
  padding: 20px;
  height: 606px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: none;
`;

const NewsHeader = styled.h3`
  margin-bottom: 15px;
  color: var(--accent-color);
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
`;

const NewsItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  background: var(--secondary-background);
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const NewsContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const NewsImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 15px;
`;

const NewsTitle = styled.a`
  font-size: 1em;
  font-weight: bold;
  color: var(--accent-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const NewsDescription = styled.p`
  font-size: 0.85em;
  color: var(--text-muted-color);
  margin-top: 5px;
  line-height: 1.4;
`;

// Loading Spinner
const Spinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid var(--accent-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1.5s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CyberSecurityNews = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/news`);
      console.log('API Response:', response.data); // Log the entire response
      
      if (response.data && response.data.articles && response.data.articles.length) {
        setArticles(response.data.articles);
      } else {
        // Fallback mock data for testing
        setArticles([
          {
            title: "Test Article",
            description: "This is a test article description.",
            url: "https://example.com",
            urlToImage: "https://via.placeholder.com/150"
          }
        ]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching cybersecurity news:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <NewsContainer>
      <NewsHeader>Latest Cybersecurity News</NewsHeader>
      {loading && <Spinner />}
      {error && <p>{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p>No latest news available at the moment. Please check back later.</p>
      )}
      {!loading && !error && articles && articles.length > 0 && articles.map((article, index) => (
        <NewsItem key={index}>
          {article.urlToImage && <NewsImage src={article.urlToImage} alt="News Thumbnail" />}
          <NewsContent>
            <NewsTitle href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </NewsTitle>
            {article.description && <NewsDescription>{article.description}</NewsDescription>}
          </NewsContent>
        </NewsItem>
      ))}
    </NewsContainer>
  );
};

export default CyberSecurityNews;