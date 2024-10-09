// src/components/CyberSecurityNews.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components (remain the same)
// ... (Omitted for brevity)

// Loading Spinner (remains the same)
// ... (Omitted for brevity)

const CyberSecurityNews = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const rssUrl = 'https://feeds.feedburner.com/TheHackersNews';
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        rssUrl
      )}`;

      const response = await axios.get(apiUrl);
      if (response.data && response.data.items && response.data.items.length) {
        setArticles(response.data.items);
      } else {
        setArticles([]);
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
        <p>No latest news available at the moment.</p>
      )}
      {!loading &&
        !error &&
        articles &&
        articles.map((article, index) => (
          <NewsItem key={index}>
            {article.thumbnail && (
              <NewsImage src={article.thumbnail} alt="News Thumbnail" />
            )}
            <NewsContent>
              <NewsTitle
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.title}
              </NewsTitle>
              {article.description && (
                <NewsDescription
                  dangerouslySetInnerHTML={{
                    __html: article.description,
                  }}
                ></NewsDescription>
              )}
            </NewsContent>
          </NewsItem>
        ))}
    </NewsContainer>
  );
};

export default CyberSecurityNews;
