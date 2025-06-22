// src/services/stockSimulationService.js

class StockSimulationService {
  constructor() {
    this.stocks = new Map();
    this.marketSession = this.getMarketSession();
    this.volatilityFactors = this.getVolatilityFactors();
    this.trendDirections = new Map();
    this.lastUpdateTime = Date.now();
  }

  // Realistic base prices for major stocks (updated periodically)
  getBasePrices() {
    return {
      'AAPL': { price: 175.50, volatility: 0.02, trend: 'neutral', sector: 'tech' },
      'MSFT': { price: 338.20, volatility: 0.018, trend: 'bullish', sector: 'tech' },
      'GOOGL': { price: 125.80, volatility: 0.022, trend: 'bullish', sector: 'tech' },
      'AMZN': { price: 142.30, volatility: 0.025, trend: 'neutral', sector: 'tech' },
      'NVDA': { price: 435.60, volatility: 0.035, trend: 'bullish', sector: 'tech' },
      'META': { price: 298.50, volatility: 0.028, trend: 'neutral', sector: 'tech' },
      'TSLA': { price: 185.40, volatility: 0.045, trend: 'bearish', sector: 'auto' },
      'JPM': { price: 152.80, volatility: 0.02, trend: 'neutral', sector: 'finance' },
      'V': { price: 245.70, volatility: 0.015, trend: 'bullish', sector: 'finance' },
      'JNJ': { price: 168.30, volatility: 0.012, trend: 'neutral', sector: 'healthcare' }
    };
  }

  // Market session affects volatility and volume
  getMarketSession() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Market times in EST
    const preMarket = { start: 4 * 60, end: 9.5 * 60, name: 'premarket' };
    const openingBell = { start: 9.5 * 60, end: 10.5 * 60, name: 'opening' };
    const midDay = { start: 10.5 * 60, end: 15 * 60, name: 'midday' };
    const closingBell = { start: 15 * 60, end: 16 * 60, name: 'closing' };
    const afterHours = { start: 16 * 60, end: 20 * 60, name: 'afterhours' };

    if (timeInMinutes >= preMarket.start && timeInMinutes < preMarket.end) return preMarket;
    if (timeInMinutes >= openingBell.start && timeInMinutes < openingBell.end) return openingBell;
    if (timeInMinutes >= midDay.start && timeInMinutes < midDay.end) return midDay;
    if (timeInMinutes >= closingBell.start && timeInMinutes < closingBell.end) return closingBell;
    if (timeInMinutes >= afterHours.start && timeInMinutes < afterHours.end) return afterHours;

    return { name: 'closed', start: 0, end: 0 };
  }

  // Different volatility factors based on market session
  getVolatilityFactors() {
    return {
      'opening': 2.5,     // High volatility at market open
      'midday': 1.0,      // Normal volatility during day
      'closing': 2.0,     // Higher volatility at close
      'premarket': 1.5,   // Moderate volatility pre-market
      'afterhours': 1.8,  // Higher volatility after hours
      'closed': 0.3       // Low volatility when market closed
    };
  }

  // Generate realistic daily price movement
  generateDailyTrend(symbol) {
    // Market news simulation (random events)
    const newsImpact = Math.random();
    let trendMultiplier = 1;

    if (newsImpact < 0.05) {
      // 5% chance of major positive news
      trendMultiplier = 1.08; // +8% day
    } else if (newsImpact < 0.1) {
      // 5% chance of major negative news
      trendMultiplier = 0.92; // -8% day
    } else if (newsImpact < 0.2) {
      // 10% chance of moderate positive news
      trendMultiplier = 1.03; // +3% day
    } else if (newsImpact < 0.3) {
      // 10% chance of moderate negative news
      trendMultiplier = 0.97; // -3% day
    }

    return trendMultiplier;
  }

  // Initialize a stock with realistic data
  initializeStock(symbol, stockInfo) {
    const baseData = this.getBasePrices()[symbol];
    if (!baseData) return null;

    // Generate opening price (slightly different from previous close)
    const overnightChange = (Math.random() - 0.5) * 0.02; // ±1% overnight
    const openPrice = baseData.price * (1 + overnightChange);
    
    // Generate day's trend
    const dailyTrend = this.generateDailyTrend(symbol);
    this.trendDirections.set(symbol, dailyTrend);

    const stock = {
      symbol,
      name: stockInfo.name,
      price: openPrice,
      previousClose: baseData.price,
      open: openPrice,
      high: openPrice,
      low: openPrice,
      volume: this.generateVolume(symbol),
      change: openPrice - baseData.price,
      changePercent: ((openPrice - baseData.price) / baseData.price) * 100,
      volatility: baseData.volatility,
      trend: baseData.trend,
      sector: baseData.sector,
      lastUpdate: Date.now(),
      dayHigh: openPrice,
      dayLow: openPrice,
      priceHistory: [{ time: Date.now(), price: openPrice }]
    };

    this.stocks.set(symbol, stock);
    return stock;
  }

  // Generate realistic trading volume
  generateVolume(symbol) {
    const baseVolumes = {
      'AAPL': 75000000,
      'MSFT': 35000000,
      'GOOGL': 25000000,
      'AMZN': 45000000,
      'NVDA': 85000000,
      'META': 40000000,
      'TSLA': 120000000,
      'JPM': 15000000,
      'V': 8000000,
      'JNJ': 12000000
    };

    const baseVolume = baseVolumes[symbol] || 20000000;
    const sessionMultiplier = this.marketSession.name === 'opening' ? 2.5 : 
                             this.marketSession.name === 'closing' ? 2.0 : 1.0;
    
    return Math.floor(baseVolume * sessionMultiplier * (0.5 + Math.random()));
  }

  // Update stock price with realistic movement
  updateStockPrice(symbol) {
    const stock = this.stocks.get(symbol);
    if (!stock) return null;

    const now = Date.now();
    const timeSinceLastUpdate = now - stock.lastUpdate;
    
    // Update every 1-3 seconds for realism
    if (timeSinceLastUpdate < 1000) return stock;

    // Get market session volatility
    const sessionVolatility = this.volatilityFactors[this.marketSession.name] || 1;
    
    // Base volatility for the stock
    const baseVolatility = stock.volatility;
    
    // Daily trend influence
    const trendInfluence = this.trendDirections.get(symbol) || 1;
    
    // Generate price movement
    let priceMovement;
    
    if (this.marketSession.name === 'closed') {
      // Minimal movement when market is closed
      priceMovement = (Math.random() - 0.5) * 0.001; // ±0.1%
    } else {
      // Normal market hours movement
      const randomWalk = (Math.random() - 0.5) * 2; // -1 to 1
      const trendBias = (trendInfluence - 1) * 0.1; // Slight bias towards daily trend
      
      priceMovement = (randomWalk * baseVolatility * sessionVolatility + trendBias) * 0.01;
    }

    // Apply movement to price
    const newPrice = stock.price * (1 + priceMovement);
    
    // Update stock data
    stock.price = Math.max(0.01, newPrice); // Prevent negative prices
    stock.change = stock.price - stock.previousClose;
    stock.changePercent = (stock.change / stock.previousClose) * 100;
    stock.high = Math.max(stock.high, stock.price);
    stock.low = Math.min(stock.low, stock.price);
    stock.dayHigh = Math.max(stock.dayHigh, stock.price);
    stock.dayLow = Math.min(stock.dayLow, stock.price);
    stock.lastUpdate = now;
    stock.volume += Math.floor(Math.random() * 100000); // Incremental volume

    // Store price history (keep last 100 points)
    stock.priceHistory.push({ time: now, price: stock.price });
    if (stock.priceHistory.length > 100) {
      stock.priceHistory.shift();
    }

    return stock;
  }

  // Get all stocks data
  getAllStocks() {
    const result = {};
    this.stocks.forEach((stock, symbol) => {
      result[symbol] = this.updateStockPrice(symbol);
    });
    return result;
  }

  // Get specific stock
  getStock(symbol) {
    return this.updateStockPrice(symbol);
  }

  // Initialize simulation with stock list
  initializeSimulation(stockList) {
    stockList.forEach(stockInfo => {
      this.initializeStock(stockInfo.symbol, stockInfo);
    });
  }

  // Market event simulation (news, earnings, etc.)
  simulateMarketEvent() {
    const eventChance = Math.random();
    
    if (eventChance < 0.001) { // 0.1% chance per update
      // Market-wide event
      const isPositive = Math.random() > 0.5;
      const impact = isPositive ? 1.02 : 0.98; // ±2% market move
      
      this.stocks.forEach(stock => {
        const multiplier = impact + (Math.random() - 0.5) * 0.01; // Add some randomness
        this.trendDirections.set(stock.symbol, 
          this.trendDirections.get(stock.symbol) * multiplier
        );
      });
      
      console.log(`🚨 Market Event: ${isPositive ? 'Positive' : 'Negative'} market-wide movement`);
    }
  }

  // Reset daily at market open
  resetDaily() {
    this.stocks.forEach(stock => {
      stock.previousClose = stock.price;
      stock.open = stock.price;
      stock.high = stock.price;
      stock.low = stock.price;
      stock.dayHigh = stock.price;
      stock.dayLow = stock.price;
      stock.change = 0;
      stock.changePercent = 0;
      stock.volume = this.generateVolume(stock.symbol);
      
      // Reset daily trend
      this.trendDirections.set(stock.symbol, this.generateDailyTrend(stock.symbol));
    });
  }

  // Get market status
  getMarketStatus() {
    return {
      session: this.marketSession.name,
      isOpen: this.marketSession.name !== 'closed',
      nextOpen: this.getNextMarketOpen(),
      volatilityFactor: this.volatilityFactors[this.marketSession.name]
    };
  }

  getNextMarketOpen() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 30, 0, 0); // 9:30 AM next day
    return tomorrow;
  }
}

// Singleton instance
export const stockSimulation = new StockSimulationService();
export default StockSimulationService;