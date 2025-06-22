// src/services/hybridStockService.js
import { stockSimulation } from './stockSimulationService';
import { POPULAR_STOCKS, FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../utils/constants';

class HybridStockService {
  constructor() {
    this.realDataFetched = false;
    this.lastFetchTime = 0;
    this.fetchAttempted = false;
    this.simulationStarted = false;
    this.realDataCache = new Map();
    
    // Cache keys for localStorage
    this.CACHE_KEY = 'stocksim_real_data_cache';
    this.CACHE_TIME_KEY = 'stocksim_cache_time';
    this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache
  }

  // Check if we have valid cached real data
  hasValidCache() {
    try {
      const cachedTime = localStorage.getItem(this.CACHE_TIME_KEY);
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      
      if (!cachedTime || !cachedData) return false;
      
      const cacheAge = Date.now() - parseInt(cachedTime);
      return cacheAge < this.CACHE_DURATION;
    } catch (error) {
      console.log('Cache check failed:', error.message);
      return false;
    }
  }

  // Load cached real data
  loadCachedData() {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const data = JSON.parse(cachedData);
        console.log('📦 Loaded cached real data for', Object.keys(data).length, 'stocks');
        return data;
      }
    } catch (error) {
      console.log('Failed to load cached data:', error.message);
    }
    return null;
  }

  // Save real data to cache
  saveCacheData(data) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(this.CACHE_TIME_KEY, Date.now().toString());
      console.log('💾 Cached real data for', Object.keys(data).length, 'stocks');
    } catch (error) {
      console.log('Failed to cache data:', error.message);
    }
  }

  // Fetch real stock data (once per session/cache period)
  async fetchRealDataOnce() {
    // Check if we already attempted this session
    if (this.fetchAttempted) {
      console.log('🔄 Real data fetch already attempted this session');
      return this.realDataCache.size > 0 ? Object.fromEntries(this.realDataCache) : null;
    }

    this.fetchAttempted = true;

    // Check cache first
    if (this.hasValidCache()) {
      const cachedData = this.loadCachedData();
      if (cachedData && Object.keys(cachedData).length > 0) {
        this.realDataFetched = true;
        this.lastFetchTime = Date.now();
        
        // Store in memory cache
        Object.entries(cachedData).forEach(([symbol, data]) => {
          this.realDataCache.set(symbol, data);
        });
        
        return cachedData;
      }
    }

    // No API key available
    if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
      console.log('🎯 No API key provided - will use simulation only');
      return null;
    }

    console.log('📡 Fetching real stock data (one-time)...');

    try {
      // Test API with a single stock first
      const testResponse = await fetch(
        `${FINNHUB_BASE_URL}/quote?symbol=AAPL&token=${FINNHUB_API_KEY}`,
        { timeout: 10000 }
      );

      if (testResponse.status === 429) {
        console.log('⚠️ API rate limited - using simulation only');
        return null;
      }

      if (!testResponse.ok) {
        console.log(`❌ API test failed with status ${testResponse.status}`);
        return null;
      }

      const testData = await testResponse.json();
      if (!testData.c || testData.c === 0) {
        console.log('❌ Invalid API response - using simulation only');
        return null;
      }

      console.log('✅ API working - fetching all stock data...');

      // Fetch all stocks with proper delays
      const stockData = {};
      const BATCH_SIZE = 3; // Smaller batches to avoid rate limits
      const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 seconds between requests
      const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds between batches

      for (let i = 0; i < POPULAR_STOCKS.length; i += BATCH_SIZE) {
        const batch = POPULAR_STOCKS.slice(i, i + BATCH_SIZE);
        console.log(`📊 Fetching batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(POPULAR_STOCKS.length/BATCH_SIZE)}: ${batch.map(s => s.symbol).join(', ')}`);

        for (let j = 0; j < batch.length; j++) {
          const stock = batch[j];
          
          try {
            // Add delay between requests
            if (i > 0 || j > 0) {
              await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
            }

            const response = await fetch(
              `${FINNHUB_BASE_URL}/quote?symbol=${stock.symbol}&token=${FINNHUB_API_KEY}`,
              { timeout: 8000 }
            );

            if (response.status === 429) {
              console.log(`⚠️ Rate limited at ${stock.symbol} - stopping fetch`);
              break;
            }

            if (!response.ok) {
              console.log(`⚠️ Failed to fetch ${stock.symbol}: HTTP ${response.status}`);
              continue;
            }

            const data = await response.json();
            
            if (data.c && data.c > 0) {
              stockData[stock.symbol] = {
                symbol: stock.symbol,
                name: stock.name,
                price: data.c,
                previousClose: data.pc,
                change: data.d || 0,
                changePercent: data.dp || 0,
                high: data.h || data.c,
                low: data.l || data.c,
                open: data.o || data.pc,
                volume: Math.floor(Math.random() * 50000000) + 10000000,
                timestamp: data.t || Math.floor(Date.now() / 1000),
                isRealData: true
              };

              console.log(`✅ Fetched ${stock.symbol}: $${data.c.toFixed(2)}`);
            }

          } catch (error) {
            console.log(`❌ Error fetching ${stock.symbol}:`, error.message);
            continue;
          }
        }

        // Add delay between batches
        if (i + BATCH_SIZE < POPULAR_STOCKS.length) {
          console.log(`⏱️ Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      if (Object.keys(stockData).length > 0) {
        console.log(`🎉 Successfully fetched real data for ${Object.keys(stockData).length} stocks`);
        
        // Cache the real data
        this.saveCacheData(stockData);
        
        // Store in memory
        Object.entries(stockData).forEach(([symbol, data]) => {
          this.realDataCache.set(symbol, data);
        });
        
        this.realDataFetched = true;
        this.lastFetchTime = Date.now();
        
        return stockData;
      } else {
        console.log('❌ No stock data fetched - using simulation only');
        return null;
      }

    } catch (error) {
      console.log('❌ Real data fetch failed:', error.message);
      return null;
    }
  }

  // Initialize stocks with real data, then start simulation
  async initializeHybridSystem() {
    console.log('🚀 Initializing hybrid stock system...');
    
    // Step 1: Try to get real data (once)
    const realData = await this.fetchRealDataOnce();
    
    // Step 2: Initialize simulation
    if (realData && Object.keys(realData).length > 0) {
      console.log('📊 Initializing simulation with real starting prices...');
      
      // Initialize simulation with real data as base
      POPULAR_STOCKS.forEach(stockInfo => {
        const realStock = realData[stockInfo.symbol];
        if (realStock) {
          // Use real data as starting point
          const simStock = stockSimulation.initializeStock(stockInfo.symbol, stockInfo);
          if (simStock) {
            // Override with real prices
            simStock.price = realStock.price;
            simStock.previousClose = realStock.previousClose;
            simStock.open = realStock.open || realStock.previousClose;
            simStock.high = realStock.high || realStock.price;
            simStock.low = realStock.low || realStock.price;
            simStock.change = realStock.change;
            simStock.changePercent = realStock.changePercent;
            simStock.volume = realStock.volume;
            simStock.isRealData = true;
          }
        } else {
          // Use simulation for stocks we couldn't fetch
          stockSimulation.initializeStock(stockInfo.symbol, stockInfo);
        }
      });
      
      return { 
        success: true, 
        realDataCount: Object.keys(realData).length,
        totalStocks: POPULAR_STOCKS.length,
        useSimulation: true,
        hasRealBase: true
      };
      
    } else {
      console.log('🎮 Initializing pure simulation (no real data available)...');
      
      // Pure simulation mode
      stockSimulation.initializeSimulation(POPULAR_STOCKS);
      
      return { 
        success: true, 
        realDataCount: 0,
        totalStocks: POPULAR_STOCKS.length,
        useSimulation: true,
        hasRealBase: false
      };
    }
  }

  // Get current stock data (always from simulation after initialization)
  getCurrentStockData() {
    return stockSimulation.getAllStocks();
  }

  // Get specific stock
  getStock(symbol) {
    return stockSimulation.getStock(symbol);
  }

  // Get market status
  getMarketStatus() {
    return stockSimulation.getMarketStatus();
  }

  // Get price history for charts
  getStockHistory(symbol) {
    const stock = stockSimulation.getStock(symbol);
    return stock?.priceHistory || [];
  }

  // Check if we have real data
  hasRealData() {
    return this.realDataFetched && this.realDataCache.size > 0;
  }

  // Get info about data sources
  getDataInfo() {
    return {
      hasRealData: this.hasRealData(),
      realDataCount: this.realDataCache.size,
      lastFetchTime: this.lastFetchTime,
      cacheValid: this.hasValidCache(),
      simulationActive: true
    };
  }

  // Force refresh (clear cache and refetch)
  async forceRefresh() {
    console.log('🔄 Force refreshing stock data...');
    
    // Clear cache
    try {
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.CACHE_TIME_KEY);
    } catch (error) {
      console.log('Failed to clear cache:', error.message);
    }
    
    // Reset state
    this.realDataFetched = false;
    this.fetchAttempted = false;
    this.realDataCache.clear();
    this.lastFetchTime = 0;
    
    // Reinitialize
    return await this.initializeHybridSystem();
  }
}

// Export singleton instance
export const hybridStockService = new HybridStockService();
export default HybridStockService;