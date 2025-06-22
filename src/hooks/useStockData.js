// src/hooks/useStockData.js
import { useState, useEffect } from 'react';
import { POPULAR_STOCKS, FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../utils/constants';

export const useStockData = () => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Rate limiting state
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchStockQuote = async (symbol, retryCount = 0) => {
    try {
      const response = await fetch(
        `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      
      // Handle rate limiting (429)
      if (response.status === 429) {
        console.warn(`Rate limited for ${symbol}. Attempt ${retryCount + 1}`);
        setIsRateLimited(true);
        
        if (retryCount < 3) {
          // Exponential backoff: wait 2^retryCount seconds
          const delay = Math.pow(2, retryCount) * 2000;
          console.log(`Retrying ${symbol} in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchStockQuote(symbol, retryCount + 1);
        } else {
          throw new Error('Rate limit exceeded after retries');
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch stock data`);
      }
      
      const data = await response.json();
      
      // Check for valid data
      if (data.c === 0 && data.h === 0 && data.l === 0) {
        throw new Error('Invalid API response - no data returned');
      }

      // Reset rate limit flag on success
      setIsRateLimited(false);

      return {
        currentPrice: data.c,
        change: data.d,
        percentChange: data.dp,
        highPrice: data.h,
        lowPrice: data.l,
        openPrice: data.o,
        previousClose: data.pc,
        timestamp: data.t
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw error;
    }
  };

  const generateMockData = () => {
    const mockData = {};
    POPULAR_STOCKS.forEach(stock => {
      const basePrice = 50 + Math.random() * 450;
      const changePercent = (Math.random() - 0.5) * 0.1; // ±5% change
      const change = basePrice * changePercent;
      
      mockData[stock.symbol] = {
        symbol: stock.symbol,
        name: stock.name,
        price: basePrice,
        previousClose: basePrice - change,
        change: change,
        changePercent: changePercent * 100,
        high: basePrice * 1.02,
        low: basePrice * 0.98,
        open: basePrice * (1 + (Math.random() - 0.5) * 0.02),
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        marketCap: Math.floor(basePrice * (Math.random() * 100 + 10) * 1000000000)
      };
    });
    return mockData;
  };

  const initializeStockData = async () => {
    setLoading(true);
    setError(null);
    setIsRateLimited(false);

    if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
      console.log('Using mock data - no API key provided');
      setApiKeyMissing(true);
      setStockData(generateMockData());
      setLoading(false);
      return;
    }

    try {
      const stockInfo = {};
      
      // Load stocks in smaller batches to avoid rate limiting
      const BATCH_SIZE = 5;
      const BATCH_DELAY = 3000; // 3 seconds between batches
      
      console.log(`Loading ${POPULAR_STOCKS.length} stocks in batches of ${BATCH_SIZE}...`);
      
      for (let batchStart = 0; batchStart < POPULAR_STOCKS.length; batchStart += BATCH_SIZE) {
        const batch = POPULAR_STOCKS.slice(batchStart, batchStart + BATCH_SIZE);
        console.log(`Loading batch ${Math.floor(batchStart/BATCH_SIZE) + 1}: ${batch.map(s => s.symbol).join(', ')}`);
        
        // Process batch with individual delays
        for (let i = 0; i < batch.length; i++) {
          const stock = batch[i];
          
          try {
            // Add delay between individual requests (1 second)
            if (batchStart > 0 || i > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            const quote = await fetchStockQuote(stock.symbol);
            
            stockInfo[stock.symbol] = {
              symbol: stock.symbol,
              name: stock.name,
              price: quote.currentPrice,
              previousClose: quote.previousClose,
              change: quote.change,
              changePercent: quote.percentChange,
              high: quote.highPrice,
              low: quote.lowPrice,
              open: quote.openPrice,
              timestamp: quote.timestamp
            };
            
            // Update state incrementally so user sees progress
            setStockData(prev => ({ ...prev, ...{[stock.symbol]: stockInfo[stock.symbol]} }));
            
          } catch (error) {
            console.error(`Failed to fetch ${stock.symbol}, using fallback data:`, error.message);
            
            // Use fallback data for failed requests
            const fallbackPrice = 100 + Math.random() * 400;
            const fallbackChange = (Math.random() - 0.5) * 10;
            
            stockInfo[stock.symbol] = {
              symbol: stock.symbol,
              name: stock.name,
              price: fallbackPrice,
              previousClose: fallbackPrice - fallbackChange,
              change: fallbackChange,
              changePercent: (fallbackChange / (fallbackPrice - fallbackChange)) * 100,
              high: fallbackPrice * 1.02,
              low: fallbackPrice * 0.98,
              open: fallbackPrice * 0.99,
              timestamp: Date.now() / 1000
            };
            
            setStockData(prev => ({ ...prev, ...{[stock.symbol]: stockInfo[stock.symbol]} }));
          }
        }
        
        // Longer delay between batches
        if (batchStart + BATCH_SIZE < POPULAR_STOCKS.length) {
          console.log(`Waiting ${BATCH_DELAY/1000} seconds before next batch...`);
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }
      
      console.log(`Successfully loaded ${Object.keys(stockInfo).length} stocks`);
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to load stock data:', error);
      setError('Failed to load stock data. Using fallback data.');
      
      // Fall back to mock data on complete failure
      setStockData(generateMockData());
      setApiKeyMissing(true);
      setLoading(false);
    }
  };

  const simulatePriceUpdates = () => {
    const interval = setInterval(() => {
      setStockData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(symbol => {
          const stock = newData[symbol];
          // Smaller price movements for more realistic simulation
          const changePercent = (Math.random() - 0.5) * 0.01; // ±0.5% change
          const newPrice = stock.price * (1 + changePercent);
          
          newData[symbol] = {
            ...stock,
            price: newPrice,
            change: newPrice - stock.previousClose,
            changePercent: ((newPrice - stock.previousClose) / stock.previousClose) * 100,
            timestamp: Date.now() / 1000
          };
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  };

  useEffect(() => {
    initializeStockData();
  }, []);

  useEffect(() => {
    // Only simulate if using mock data or fallback data
    if (apiKeyMissing || error) {
      const cleanup = simulatePriceUpdates();
      return cleanup;
    }
  }, [apiKeyMissing, error]);

  const refreshStockData = () => {
    initializeStockData();
  };

  const getStock = (symbol) => {
    return stockData[symbol] || null;
  };

  const searchStocks = (term) => {
    if (!term) return Object.values(stockData);
    
    return Object.values(stockData).filter(stock =>
      stock.symbol.toLowerCase().includes(term.toLowerCase()) ||
      stock.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  return {
    stockData,
    loading,
    error,
    apiKeyMissing,
    isRateLimited,
    refreshStockData,
    getStock,
    searchStocks
  };
};