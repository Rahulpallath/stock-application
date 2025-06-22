// src/MainApp.js
import React, { useState, useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';

// Hooks
import { useApi } from './hooks/useApi';
import { useStockData } from './hooks/useStockData';
import { usePortfolio } from './hooks/usePortfolio';

// Layout Components
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import LoadingScreen from './components/layout/LoadingScreen';

// Page Components
import HomePage from './components/home/HomePage';
import PortfolioPage from './components/portfolio/PortfolioPage';
import TradePage from './components/trade/TradePage';

// Utils and Constants
import { NAV_TABS, DATA_TYPES, DEFAULT_USER_DATA } from './utils/constants';

const MainApp = ({ user }) => {
  const userId = user.username;
  
  // State
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState(NAV_TABS.HOME);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hooks
  const { saveUserData, getUserData } = useApi();
  const { stockData, loading: stockLoading, apiKeyMissing } = useStockData();
  const {
    portfolio,
    transactions,
    loading: portfolioLoading,
    executeTrade,
    getPortfolioValue,
    getHoldings,
    getTransactionHistory,
    getPortfolioStats,
    resetPortfolio
  } = usePortfolio(userId, stockData);

  // Load user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const info = await getUserData(userId, DATA_TYPES.USER_INFO);
        
        setUserData(info || {
          name: user.attributes?.email || user.username,
          ...DEFAULT_USER_DATA
        });
      } catch (err) {
        console.error('Error loading user data:', err);
        setUserData({
          name: user.attributes?.email || user.username,
          ...DEFAULT_USER_DATA
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, user]);

  // Save user data when it changes
  useEffect(() => {
    if (userData && !isLoading) {
      saveUserData(userId, DATA_TYPES.USER_INFO, userData).catch(console.error);
    }
  }, [userData, userId, isLoading]);

  // Update portfolio value when portfolio or stock data changes
  useEffect(() => {
    if (!userData || portfolioLoading) return;
    
    const portfolioValue = getPortfolioValue();
    
    setUserData(prev => ({
      ...prev,
      portfolioValue,
      totalValue: prev.cash + portfolioValue
    }));
  }, [portfolio, stockData, portfolioLoading]);

  // Real-time portfolio updates when stock prices change (for simulation)
  useEffect(() => {
    if (!userData || portfolioLoading || Object.keys(portfolio).length === 0) return;

    const updateInterval = setInterval(() => {
      const newPortfolioValue = getPortfolioValue();
      
      setUserData(prev => {
        // Only update if there's a meaningful change (avoid constant re-renders)
        const priceDiff = Math.abs(newPortfolioValue - prev.portfolioValue);
        if (priceDiff > 0.01) {
          return {
            ...prev,
            portfolioValue: newPortfolioValue,
            totalValue: prev.cash + newPortfolioValue
          };
        }
        return prev;
      });
    }, 3000); // Update portfolio value every 3 seconds

    return () => clearInterval(updateInterval);
  }, [portfolio, stockData, portfolioLoading, userData?.cash]);

  // Trading functions
  const handleBuySell = (symbol, quantity, orderType) => {
    if (!stockData[symbol] || !userData) return false;

    const stock = stockData[symbol];
    const totalCost = stock.price * quantity;

    if (orderType === 'buy') {
      if (userData.cash >= totalCost) {
        setUserData(prev => ({ ...prev, cash: prev.cash - totalCost }));
        const result = executeTrade(symbol, quantity, stock.price, 'buy');
        return result.success;
      } else {
        alert('Insufficient funds!');
        return false;
      }
    } else {
      if ((portfolio[symbol] || 0) >= quantity) {
        setUserData(prev => ({ ...prev, cash: prev.cash + totalCost }));
        const result = executeTrade(symbol, quantity, stock.price, 'sell');
        return result.success;
      } else {
        alert('Insufficient shares!');
        return false;
      }
    }
  };

  // Utility functions
  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
    setActiveTab(NAV_TABS.TRADE);
  };

  const handleExportData = () => {
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

  const handleImportData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.userData) setUserData(data.userData);
        if (data.portfolio) {
          // Note: Portfolio state is managed by the usePortfolio hook
          // You might need to add an import function to that hook
        }
        if (data.transactions) {
          // Same for transactions
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAllData = async () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear your portfolio, transactions, and reset your cash to $10,000.')) {
      const defaultUser = {
        name: user.attributes?.email || user.username,
        ...DEFAULT_USER_DATA
      };
      
      setUserData(defaultUser);
      resetPortfolio();
      
      // Save reset data to DynamoDB
      await Promise.all([
        saveUserData(userId, DATA_TYPES.USER_INFO, defaultUser),
        saveUserData(userId, DATA_TYPES.PORTFOLIO, {}),
        saveUserData(userId, DATA_TYPES.TRANSACTIONS, [])
      ]);
      
      alert('All data has been reset!');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading screen while data is loading
  if (isLoading || portfolioLoading) {
    return <LoadingScreen />;
  }

  // Render page content based on active tab
  const renderPageContent = () => {
    switch (activeTab) {
      case NAV_TABS.HOME:
        return (
          <HomePage
            userData={userData}
            stockData={stockData}
            loading={stockLoading}
            apiKeyMissing={apiKeyMissing}
            onStockSelect={handleStockSelect}
          />
        );
      
      case NAV_TABS.PORTFOLIO:
        return (
          <PortfolioPage
            holdings={getHoldings()}
            transactions={getTransactionHistory()}
            portfolioStats={getPortfolioStats()}
            stockData={stockData}
          />
        );
      
      case NAV_TABS.TRADE:
        return (
          <TradePage
            stockData={stockData}
            loading={stockLoading}
            selectedStock={selectedStock}
            onStockSelect={setSelectedStock}
            userData={userData}
            portfolio={portfolio}
            onTrade={handleBuySell}
          />
        );
      
      default:
        return <HomePage userData={userData} stockData={stockData} loading={stockLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        userData={userData}
        onSignOut={handleSignOut}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetAllData}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {renderPageContent()}
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default MainApp;