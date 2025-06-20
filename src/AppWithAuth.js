import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Home, Briefcase, Activity, User, ArrowUpRight, ArrowDownRight, AlertCircle, Loader, LogOut } from 'lucide-react';
import { Amplify } from 'aws-amplify';
import { get, post } from 'aws-amplify/api';
import { signOut } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

// Configure Amplify
Amplify.configure(awsExports);

// API configuration
const apiName = 'stocktradingapi';
const path = '/portfolio';

// Portfolio Service Functions
const saveUserData = async (userId, dataType, data) => {
  try {
    const body = {
      userId,
      dataType,
      data: JSON.stringify(data),
      updatedAt: new Date().toISOString()
    };
    
    await post({
      apiName: apiName,
      path: path,
      options: {
        body: body
      }
    }).response;
    
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, error };
  }
};

const getUserData = async (userId, dataType) => {
  try {
    const response = await get({
      apiName: apiName,
      path: `${path}/${userId}/${dataType}`
    }).response;
    
    const data = await response.body.json();
    return data.data ? JSON.parse(data.data) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Finnhub API configuration
const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Popular stocks list
const INITIAL_STOCKS = [
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

const ADDITIONAL_STOCKS = [
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

const POPULAR_STOCKS = [...INITIAL_STOCKS, ...ADDITIONAL_STOCKS];

// Main component wrapper with authentication
const StockTradingSimulatorAuth = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <MainApp user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
};

// Main App Component
const MainApp = ({ user, signOut }) => {
  const userId = user.username;
  
  // All state declarations should be inside the component
  const [userData, setUserData] = useState(null);
  const [portfolio, setPortfolio] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('buy');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Load user data from DynamoDB on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const info = await getUserData(userId, 'USER_INFO');
        const port = await getUserData(userId, 'PORTFOLIO');
        const txns = await getUserData(userId, 'TRANSACTIONS');

        setUserData(info || {
          name: user.attributes?.email || user.username,
          cash: 10000,
          portfolioValue: 0,
          totalValue: 10000
        });

        setPortfolio(port || {});
        setTransactions(txns || []);
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [userId, user]);

  // Save user info when it changes
  useEffect(() => {
    if (userData && !isLoading) {
      saveUserData(userId, 'USER_INFO', userData).catch(console.error);
    }
  }, [userData, userId, isLoading]);

  // Save portfolio when it changes
  useEffect(() => {
    if (!isLoading) {
      saveUserData(userId, 'PORTFOLIO', portfolio).catch(console.error);
    }
  }, [portfolio, userId, isLoading]);

  // Save transactions when they change
  useEffect(() => {
    if (!isLoading) {
      saveUserData(userId, 'TRANSACTIONS', transactions).catch(console.error);
    }
  }, [transactions, userId, isLoading]);

  // Fetch stock quote from Finnhub
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

  // Initialize stock data with batch requests
  const initializeStockData = async () => {
    setLoading(true);
    setError(null);

    if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
      setApiKeyMissing(true);
      setLoading(false);
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
      setStockData(mockData);
      return;
    }

    try {
      const stockInfo = {};
      
      for (let i = 0; i < INITIAL_STOCKS.length; i++) {
        const stock = INITIAL_STOCKS[i];
        
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
      
      // Load additional stocks in background
      setTimeout(async () => {
        for (let i = 0; i < ADDITIONAL_STOCKS.length; i++) {
          const stock = ADDITIONAL_STOCKS[i];
          
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

  // Initialize data on component mount
  useEffect(() => {
    initializeStockData();
  }, []);

  // Update prices periodically
  useEffect(() => {
    if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
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
    }
  }, []);

  // Update portfolio value
  useEffect(() => {
    if (!userData) return;
    
    let totalPortfolioValue = 0;
    Object.entries(portfolio).forEach(([symbol, quantity]) => {
      if (stockData[symbol]) {
        totalPortfolioValue += stockData[symbol].price * quantity;
      }
    });
    
    setUserData(prev => ({
      ...prev,
      portfolioValue: totalPortfolioValue,
      totalValue: prev.cash + totalPortfolioValue
    }));
  }, [portfolio, stockData]);

  const handleBuySell = () => {
    if (!selectedStock || !orderQuantity || orderQuantity <= 0) return;

    const stock = stockData[selectedStock];
    const quantity = parseInt(orderQuantity);
    const totalCost = stock.price * quantity;

    if (orderType === 'buy') {
      if (userData?.cash >= totalCost) {
        setUserData(prev => ({ ...prev, cash: prev.cash - totalCost }));
        setPortfolio(prev => ({
          ...prev,
          [selectedStock]: (prev[selectedStock] || 0) + quantity
        }));
        
        setTransactions(prev => [{
          id: Date.now(),
          type: 'buy',
          symbol: selectedStock,
          quantity,
          price: stock.price,
          total: totalCost,
          timestamp: new Date().toLocaleString()
        }, ...prev]);
      } else {
        alert('Insufficient funds!');
      }
    } else {
      if (portfolio[selectedStock] >= quantity) {
        setUserData(prev => ({ ...prev, cash: prev.cash + totalCost }));
        setPortfolio(prev => ({
          ...prev,
          [selectedStock]: prev[selectedStock] - quantity
        }));
        
        setTransactions(prev => [{
          id: Date.now(),
          type: 'sell',
          symbol: selectedStock,
          quantity,
          price: stock.price,
          total: totalCost,
          timestamp: new Date().toLocaleString()
        }, ...prev]);
      } else {
        alert('Insufficient shares!');
      }
    }

    setOrderQuantity('');
  };

  const filteredStocks = Object.values(stockData).filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetAllData = async () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear your portfolio, transactions, and reset your cash to $10,000.')) {
      const defaultUser = {
        name: user.attributes?.email || user.username,
        cash: 10000,
        portfolioValue: 0,
        totalValue: 10000
      };
      
      setUserData(defaultUser);
      setPortfolio({});
      setTransactions([]);
      
      // Save reset data to DynamoDB
      await Promise.all([
        saveUserData(userId, 'USER_INFO', defaultUser),
        saveUserData(userId, 'PORTFOLIO', {}),
        saveUserData(userId, 'TRANSACTIONS', [])
      ]);
      
      alert('All data has been reset!');
    }
  };

  const exportData = () => {
    const data = {
      userData,
      portfolio,
      transactions,
      exportDate: new Date().toISOString(),
      username: user.username
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `stock-sim-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (data.userData) setUserData(data.userData);
          if (data.portfolio) setPortfolio(data.portfolio);
          if (data.transactions) setTransactions(data.transactions);
          
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading screen while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <div className="space-y-6">
      {apiKeyMissing && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> Using simulated data. To use real-time data:
              </p>
              <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside">
                <li>Get a free API key from <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="underline">finnhub.io</a></li>
                <li>Add your API key to the .env file</li>
                <li>Restart the app with npm start</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {userData?.name || 'User'}!</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-blue-100">Total Value</p>
            <p className="text-3xl font-bold">${(userData?.totalValue || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-blue-100">Cash Available</p>
            <p className="text-2xl font-semibold">${(userData?.cash || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-blue-100">Portfolio Value</p>
            <p className="text-2xl font-semibold">${(userData?.portfolioValue || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Market Movers</h3>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(stockData).slice(0, 6).map(stock => (
              <div
                key={stock.symbol}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedStock(stock.symbol);
                  setActiveTab('trade');
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span className="text-sm font-semibold">
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Portfolio</h2>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Holdings</h3>
        </div>
        <div className="divide-y">
          {Object.entries(portfolio).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
              <p>No holdings yet. Start trading to build your portfolio!</p>
            </div>
          ) : (
            Object.entries(portfolio).map(([symbol, quantity]) => {
              const stock = stockData[symbol];
              if (!stock || quantity === 0) return null;
              
              const value = stock.price * quantity;
              const totalCost = transactions
                .filter(t => t.symbol === symbol && t.type === 'buy')
                .reduce((sum, t) => sum + t.total, 0) -
                transactions
                .filter(t => t.symbol === symbol && t.type === 'sell')
                .reduce((sum, t) => sum + t.total, 0);
              
              const profit = value - totalCost;
              const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;
              
              return (
                <div key={symbol} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold">{symbol}</h4>
                      <p className="text-sm text-gray-600">{quantity} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${value.toFixed(2)}</p>
                      <p className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Transactions</h3>
        </div>
        <div className="divide-y">
          {transactions.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No transactions yet</p>
          ) : (
            transactions.slice(0, 10).map(transaction => (
              <div key={transaction.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded font-semibold mr-2 ${
                      transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type.toUpperCase()}
                    </span>
                    <span className="font-semibold">{transaction.symbol}</span>
                    <span className="text-gray-600 ml-2">{transaction.quantity} shares @ ${transaction.price.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${transaction.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderTrade = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks..."
          className="flex-1 p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">Stocks</h3>
          <div className="bg-white rounded-lg shadow divide-y max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              filteredStocks.map(stock => (
                <div
                  key={stock.symbol}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedStock === stock.symbol ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedStock(stock.symbol)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold">{stock.symbol}</h4>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${stock.price.toFixed(2)}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Trade</h3>
          {selectedStock ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-bold text-lg mb-4">{selectedStock}</h4>
              <p className="text-2xl font-bold mb-4">
                ${stockData[selectedStock]?.price.toFixed(2)}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`py-2 px-4 rounded ${orderType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setOrderType('buy')}
                    >
                      Buy
                    </button>
                    <button
                      className={`py-2 px-4 rounded ${orderType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setOrderType('sell')}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Estimated Total</span>
                    <span className="font-semibold">
                      ${(stockData[selectedStock]?.price * (orderQuantity || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Available Cash</span>
                    <span className="font-semibold">${(userData?.cash || 0).toFixed(2)}</span>
                  </div>
                  
                  <button
                    className={`w-full py-3 rounded font-semibold ${
                      orderType === 'buy' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    onClick={handleBuySell}
                  >
                    {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedStock}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a stock to trade</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">StockSim</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">User: {user.username}</span>
              <span className="text-sm text-gray-600">Cash: ${(userData?.cash || 0).toFixed(2)}</span>
              <span className="text-sm font-semibold">Total: ${(userData?.totalValue || 0).toFixed(2)}</span>
              
              {/* Settings Dropdown */}
              <div className="relative group">
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={exportData}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export Data
                    </button>
                    <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Import Data
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                    </label>
                    <hr className="my-1" />
                    <button
                      onClick={resetAllData}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Reset All Data
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'trade' && renderTrade()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            <button
              className={`flex flex-col items-center py-3 px-6 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              className={`flex flex-col items-center py-3 px-6 ${activeTab === 'portfolio' ? 'text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Briefcase size={24} />
              <span className="text-xs mt-1">Portfolio</span>
            </button>
            <button
              className={`flex flex-col items-center py-3 px-6 ${activeTab === 'trade' ? 'text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('trade')}
            >
              <Activity size={24} />
              <span className="text-xs mt-1">Trade</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default StockTradingSimulatorAuth;