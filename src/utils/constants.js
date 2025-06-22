// src/utils/constants.js

// Finnhub API configuration
export const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY';
export const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Popular stocks list
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

export const ADDITIONAL_STOCKS = [
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble' },
  { symbol: 'UNH', name: 'UnitedHealth Group' },
  { symbol: 'HD', name: 'The Home Depot' },
  { symbol: 'MA', name: 'Mastercard Inc.' },
  { symbol: 'DIS', name: 'The Walt Disney Company' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'PFE', name: 'Pfizer Inc.' }
];

export const POPULAR_STOCKS = [...INITIAL_STOCKS, ...ADDITIONAL_STOCKS];

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

// Time settings
export const TIME_SETTINGS = {
  PRICE_UPDATE_INTERVAL: 5000, // 5 seconds
  API_RATE_LIMIT_DELAY: 500, // 500ms between API calls
  DATA_SAVE_DEBOUNCE: 1000 // 1 second debounce for saving data
};