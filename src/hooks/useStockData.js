import { useState, useEffect, useRef } from 'react';
import { hybridStockService } from '../services/hybridStockService';

export const useStockData = () => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [marketStatus, setMarketStatus] = useState(null);
  const [initializationComplete, setInitializationComplete] = useState(false);
  
  const updateIntervalRef = useRef(null);
  const initializationRef = useRef(false);

  // Check if API key is properly configured
  const getApiKeyStatus = () => {
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    return !apiKey || apiKey === 'YOUR_FINNHUB_API_KEY' || apiKey.trim() === '';
  };

  // Initialize the hybrid system (real data once, then simulation)
  const initializeStockData = async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting hybrid stock data system...');
      
      // Initialize hybrid system (fetches real data once, then starts simulation)
      const result = await hybridStockService.initializeHybridSystem();
      
      if (result.success) {
        // Get initial stock data from simulation (now based on real data if available)
        const initialStockData = hybridStockService.getCurrentStockData();
        setStockData(initialStockData);
        
        // Get market status
        const status = hybridStockService.getMarketStatus();
        setMarketStatus(status);
        
        // Set data info
        setDataInfo({
          hasRealData: result.hasRealBase,
          realDataCount: result.realDataCount,
          totalStocks: result.totalStocks,
          useSimulation: true,
          message: result.hasRealBase 
            ? `Started with real prices for ${result.realDataCount} stocks, now using live simulation`
            : 'Using pure simulation mode - no real data available',
          fetchAttempted: true // Key flag to indicate we've tried fetching
        });
        
        console.log('✅ Hybrid system initialized:', {
          realDataCount: result.realDataCount,
          totalStocks: result.totalStocks,
          hasRealBase: result.hasRealBase
        });
        
      } else {
        throw new Error('Failed to initialize hybrid system');
      }
      
    } catch (err) {
      console.error('❌ Failed to initialize stock data:', err);
      setError('Failed to load stock data. Please refresh the page.');
      
      // Set dataInfo even on error so we don't show warning prematurely
      setDataInfo({
        hasRealData: false,
        realDataCount: 0,
        totalStocks: 0,
        useSimulation: true,
        message: 'Error loading data - using simulation only',
        fetchAttempted: true
      });
    } finally {
      setLoading(false);
      setInitializationComplete(true);
    }
  };

  // Start real-time simulation updates
  const startSimulationUpdates = () => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    updateIntervalRef.current = setInterval(() => {
      try {
        // Get updated data from simulation
        const updatedData = hybridStockService.getCurrentStockData();
        setStockData(updatedData);
        
        // Update market status
        const status = hybridStockService.getMarketStatus();
        setMarketStatus(status);
        
        // Update data info
        const info = hybridStockService.getDataInfo();
        setDataInfo(prev => ({
          ...prev,
          ...info,
          lastUpdate: new Date().toLocaleTimeString(),
          fetchAttempted: true
        }));
        
      } catch (error) {
        console.error('Error updating stock data:', error);
      }
    }, 2000); // Update every 2 seconds
  };

  // Initialize on mount
  useEffect(() => {
    initializeStockData();
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // Start simulation updates after data is loaded
  useEffect(() => {
    if (!loading && Object.keys(stockData).length > 0) {
      console.log('📊 Starting real-time simulation updates...');
      startSimulationUpdates();
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [loading]);

  // Handle visibility change (pause/resume updates when tab is hidden/visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - stop updates to save resources
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = null;
          console.log('⏸️ Paused updates (tab hidden)');
        }
      } else {
        // Tab is visible - resume updates
        if (!updateIntervalRef.current && !loading) {
          console.log('▶️ Resumed updates (tab visible)');
          startSimulationUpdates();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading]);

  // Refresh stock data (force new real data fetch)
  const refreshStockData = async () => {
    setLoading(true);
    initializationRef.current = false;
    
    try {
      const result = await hybridStockService.forceRefresh();
      const refreshedData = hybridStockService.getCurrentStockData();
      setStockData(refreshedData);
      
      setDataInfo({
        hasRealData: result.hasRealBase,
        realDataCount: result.realDataCount,
        totalStocks: result.totalStocks,
        useSimulation: true,
        message: 'Data refreshed successfully',
        lastRefresh: new Date().toLocaleTimeString(),
        fetchAttempted: true
      });
      
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
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

  const getStockHistory = (symbol) => {
    return hybridStockService.getStockHistory(symbol);
  };

  // Get detailed status for debugging/info
  const getSystemStatus = () => {
    return {
      ...dataInfo,
      marketStatus,
      stockCount: Object.keys(stockData).length,
      isLoading: loading,
      hasError: !!error,
      updateInterval: updateIntervalRef.current ? 'Active' : 'Paused'
    };
  };

  return {
    // Data
    stockData,
    loading,
    error,
    
    // Status and info
    marketStatus,
    dataInfo,
    useSimulation: true, // Always true in hybrid mode
    // Only show API warning if initialization is complete and no real data AND no API key
    apiKeyMissing: initializationComplete && !dataInfo?.hasRealData && getApiKeyStatus(),
    
    // Functions
    refreshStockData,
    getStock,
    searchStocks,
    getStockHistory,
    getSystemStatus
  };
};
