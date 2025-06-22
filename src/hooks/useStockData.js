// src/hooks/useStockData.js
import { useState, useEffect } from 'react';
import { POPULAR_STOCKS, FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../utils/constants';

export const useStockData = () => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const fetchStockQuote = async (symbol) => {
    try {
      const response = await fetch(
        `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      
      if (data.c === 0 && data.h === 0 && data.l === 0) {
        throw new Error('Invalid API response');
      }

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
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  };

  const generateMockData = () => {
    const mockData = {};
    POPULAR_STOCKS.forEach(stock => {
      const basePrice = 50 + Math.random() * 450;
      mockData[stock.symbol] = {
        symbol: stock.symbol,
        name: stock.name,
        price: basePrice,
        previousClose: basePrice,
        change: 0,
        changePercent: 0,
        high: basePrice * 1.02,
        low: basePrice * 0.98,
        open: basePrice,
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        marketCap: Math.floor(basePrice * (Math.random() * 100 + 10) * 1000000000)
      };
    });
    return mockData;
  };

  const initializeStockData = async () => {
    setLoading(true);
    setError(null);

    if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
      setApiKeyMissing(true);
      setStockData(generateMockData());
      setLoading(false);
      return;
    }

    try {
      const stockInfo = {};
      const initialStocks = POPULAR_STOCKS.slice(0, 10); // Load first 10 stocks initially
      
      for (let i = 0; i < initialStocks.length; i++) {
        const stock = initialStocks[i];
        
        try {
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
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
        } catch (error) {
          console.error(`Failed to fetch ${stock.symbol}:`, error);
          stockInfo[stock.symbol] = {
            symbol: stock.symbol,
            name: stock.name,
            price: 100,
            previousClose: 100,
            change: 0,
            changePercent: 0,
            high: 100,
            low: 100,
            open: 100
          };
        }
      }
      
      setStockData(stockInfo);
      setLoading(false);
      
      // Load remaining stocks in background
      setTimeout(async () => {
        const remainingStocks = POPULAR_STOCKS.slice(10);
        for (let i = 0; i < remainingStocks.length; i++) {
          const stock = remainingStocks[i];
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const quote = await fetchStockQuote(stock.symbol);
            
            setStockData(prev => ({
              ...prev,
              [stock.symbol]: {
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
              }
            }));
          } catch (error) {
            console.error(`Failed to fetch ${stock.symbol}:`, error);
          }
        }
      }, 100);
      
    } catch (error) {
      setError('Failed to load stock data. Please try again later.');
      setLoading(false);
    }
  };

  const simulatePriceUpdates = () => {
    if (!apiKeyMissing) return;

    const interval = setInterval(() => {
      setStockData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(symbol => {
          const stock = newData[symbol];
          const changePercent = (Math.random() - 0.5) * 0.02;
          const newPrice = stock.price * (1 + changePercent);
          
          newData[symbol] = {
            ...stock,
            price: newPrice,
            change: newPrice - stock.previousClose,
            changePercent: ((newPrice - stock.previousClose) / stock.previousClose) * 100
          };
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    initializeStockData();
  }, []);

  useEffect(() => {
    const cleanup = simulatePriceUpdates();
    return cleanup;
  }, [apiKeyMissing]);

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
    refreshStockData,
    getStock,
    searchStocks
  };
};