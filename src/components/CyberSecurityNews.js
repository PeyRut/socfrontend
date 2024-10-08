import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const NewsContainer = styled.div`
  background: var(--card-background);
  color: var(--text-color);
  border-radius: 8px;
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
`;

const NewsItem = styled.div`
  margin-bottom: 15px;
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
  font-size: 0.9em;
  color: var(--role-text-color);
`;

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
      const API_KEY = process.env.REACT_APP_NEWSAPI_KEY; // Use environment variable
      if (!API_KEY) {
        throw new Error('API key is not defined');
      }

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=cybersecurity&sortBy=publishedAt&language=en&pageSize=10&apiKey=${API_KEY}`
      );
      setArticles(response.data.articles);
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
      {!loading && !error && articles.length === 0 && <p>No latest news available at the moment.</p>}
      {!loading && !error && articles.map((article, index) => (
        <NewsItem key={index}>
          <NewsTitle href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </NewsTitle>
          <NewsDescription>{article.description}</NewsDescription>
        </NewsItem>
      ))}
    </NewsContainer>
  );
};

export default CyberSecurityNews;
