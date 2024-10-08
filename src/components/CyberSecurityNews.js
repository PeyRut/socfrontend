import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const NEWS_WIDGET_HEIGHT = '606px';

const NewsContainer = styled.div`
  background: var(--card-background);
  color: var(--text-color);
  border-radius: 8px;
  padding: 20px;
  height: ${NEWS_WIDGET_HEIGHT};
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
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 10px;
  border: 2px solid #121212;
  border-radius: 8px;
`;

const NewsImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #121212;
  margin-right: 10px;
`;

const NewsContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NewsTitle = styled.a`
  font-size: 1em;
  font-weight: bold;
  color: var(--accent-color);
  text-decoration: none;
  margin-bottom: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const NewsDescription = styled.p`
  font-size: 0.9em;
  color: var(--role-text-color);
  margin: 0;
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
      const response = await axios.get('/api/news');
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
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
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
          {article.urlToImage && <NewsImage src={article.urlToImage} alt="News" />}
          <NewsContent>
            <NewsTitle href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </NewsTitle>
            <NewsDescription>{article.description}</NewsDescription>
          </NewsContent>
        </NewsItem>
      ))}
    </NewsContainer>
  );
};

export default CyberSecurityNews;