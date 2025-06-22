// src/utils/constants.js

// Finnhub API configuration
export const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY';
export const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Reduced stock list to avoid rate limiting - start with top 10 stocks
export const INITIAL_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' }
];

// Additional stocks to load gradually (to avoid overwhelming the API)
export const ADDITIONAL_STOCKS = [
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble' },
  { symbol: 'UNH', name: 'UnitedHealth Group' },
  { symbol: 'HD', name: 'The Home Depot' },
  { symbol: 'MA', name: 'Mastercard Inc.' }
];

// Use only initial stocks to avoid rate limiting
export const POPULAR_STOCKS = INITIAL_STOCKS;

// Default user settings
export const DEFAULT_USER_DATA = {
  cash: 10000,
  portfolioValue: 0,
  totalValue: 10000
};

// App navigation tabs
export const NAV_TABS = {
  HOME: 'home',
  PORTFOLIO: 'portfolio',
  TRADE: 'trade'
};

// Data types for API
export const DATA_TYPES = {
  USER_INFO: 'USER_INFO',
  PORTFOLIO: 'PORTFOLIO',
  TRANSACTIONS: 'TRANSACTIONS'
};

// Transaction types
export const TRANSACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell'
};

// API configuration
export const API_CONFIG = {
  API_NAME: 'stocktradingapi',
  PATH: '/portfolio'
};

// Updated time settings for better rate limiting
export const TIME_SETTINGS = {
  PRICE_UPDATE_INTERVAL: 10000, // 10 seconds (slower updates)
  API_RATE_LIMIT_DELAY: 1000, // 1 second between API calls
  BATCH_DELAY: 3000, // 3 seconds between batches
  DATA_SAVE_DEBOUNCE: 1000 // 1 second debounce for saving data
};