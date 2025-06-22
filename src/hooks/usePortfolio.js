// src/hooks/usePortfolio.js
import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { DATA_TYPES, TRANSACTION_TYPES } from '../utils/constants';

export const usePortfolio = (userId, stockData) => {
  const [portfolio, setPortfolio] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { saveUserData, getUserData } = useApi();

  // Load portfolio data on mount
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!userId) return;
      
      try {
        const [portfolioData, transactionData] = await Promise.all([
          getUserData(userId, DATA_TYPES.PORTFOLIO),
          getUserData(userId, DATA_TYPES.TRANSACTIONS)
        ]);

        setPortfolio(portfolioData || {});
        setTransactions(transactionData || []);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [userId]);

  // Save portfolio when it changes
  useEffect(() => {
    if (!loading && userId) {
      saveUserData(userId, DATA_TYPES.PORTFOLIO, portfolio);
    }
  }, [portfolio, userId, loading]);

  // Save transactions when they change
  useEffect(() => {
    if (!loading && userId) {
      saveUserData(userId, DATA_TYPES.TRANSACTIONS, transactions);
    }
  }, [transactions, userId, loading]);

  const executeTrade = (symbol, quantity, price, type) => {
    if (!stockData[symbol] || quantity <= 0) {
      return { success: false, error: 'Invalid trade parameters' };
    }

    const totalCost = price * quantity;

    if (type === TRANSACTION_TYPES.BUY) {
      // Update portfolio
      setPortfolio(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + quantity
      }));
    } else if (type === TRANSACTION_TYPES.SELL) {
      // Check if user has enough shares
      if ((portfolio[symbol] || 0) < quantity) {
        return { success: false, error: 'Insufficient shares' };
      }

      // Update portfolio
      setPortfolio(prev => ({
        ...prev,
        [symbol]: prev[symbol] - quantity
      }));
    }

    // Add transaction
    const transaction = {
      id: Date.now(),
      type,
      symbol,
      quantity,
      price,
      total: totalCost,
      timestamp: new Date().toLocaleString(),
      date: new Date().toISOString()
    };

    setTransactions(prev => [transaction, ...prev]);

    return { success: true, transaction };
  };

  const getPortfolioValue = () => {
    let totalValue = 0;
    Object.entries(portfolio).forEach(([symbol, quantity]) => {
      if (stockData[symbol] && quantity > 0) {
        totalValue += stockData[symbol].price * quantity;
      }
    });
    return totalValue;
  };

  const getHoldings = () => {
    return Object.entries(portfolio)
      .filter(([symbol, quantity]) => quantity > 0 && stockData[symbol])
      .map(([symbol, quantity]) => {
        const stock = stockData[symbol];
        const currentValue = stock.price * quantity;
        
        // Calculate cost basis from transactions
        const buyTransactions = transactions.filter(t => 
          t.symbol === symbol && t.type === TRANSACTION_TYPES.BUY
        );
        const sellTransactions = transactions.filter(t => 
          t.symbol === symbol && t.type === TRANSACTION_TYPES.SELL
        );
        
        const totalCost = buyTransactions.reduce((sum, t) => sum + t.total, 0) -
                         sellTransactions.reduce((sum, t) => sum + t.total, 0);
        
        const profit = currentValue - totalCost;
        const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;

        return {
          symbol,
          quantity,
          currentPrice: stock.price,
          currentValue,
          totalCost,
          profit,
          profitPercent,
          stock
        };
      });
  };

  const getTransactionHistory = (limit = 50) => {
    return transactions
      .slice(0, limit)
      .map(transaction => ({
        ...transaction,
        currentPrice: stockData[transaction.symbol]?.price || transaction.price
      }));
  };

  const getPortfolioStats = () => {
    const holdings = getHoldings();
    const portfolioValue = getPortfolioValue();
    const totalCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
    const totalProfit = portfolioValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return {
      portfolioValue,
      totalCost,
      totalProfit,
      totalProfitPercent,
      holdingsCount: holdings.length,
      transactionsCount: transactions.length
    };
  };

  const resetPortfolio = () => {
    setPortfolio({});
    setTransactions([]);
  };

  return {
    portfolio,
    transactions,
    loading,
    executeTrade,
    getPortfolioValue,
    getHoldings,
    getTransactionHistory,
    getPortfolioStats,
    resetPortfolio
  };
};