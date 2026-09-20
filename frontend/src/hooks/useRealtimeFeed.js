import { useState, useEffect } from 'react';

export function useRealtimeFeed() {
  const [isConnected, setIsConnected] = useState(false);
  const [tickerEvents, setTickerEvents] = useState([]);
  const [scraperLogs, setScraperLogs] = useState([]);
  const [latestProductScraped, setLatestProductScraped] = useState(null);

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const streamUrl = `${API}/products/live-stream`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    eventSource.addEventListener('connected', (e) => {
      setIsConnected(true);
    });

    eventSource.addEventListener('ticker-event', (e) => {
      try {
        const data = JSON.parse(e.data);
        setTickerEvents((prev) => [data, ...prev.slice(0, 19)]);
      } catch {
        // ignore parse error
      }
    });

    eventSource.addEventListener('scraper-log', (e) => {
      try {
        const data = JSON.parse(e.data);
        setScraperLogs((prev) => [data, ...prev.slice(0, 49)]);
      } catch {
        // ignore parse error
      }
    });

    eventSource.addEventListener('new-product-scraped', (e) => {
      try {
        const data = JSON.parse(e.data);
        setLatestProductScraped(data);
      } catch {
        // ignore parse error
      }
    });

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  return {
    isConnected,
    tickerEvents,
    scraperLogs,
    latestProductScraped,
  };
}
