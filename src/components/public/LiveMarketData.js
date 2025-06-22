// src/components/public/LiveMarketData.js
import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Loader, Lock, TrendingUp } from 'lucide-react';
import StockChart from './StockChart';
import MarketStatus from '../common/MarketStatus';
import { useStockData } from '../../hooks/useStockData';

const LiveMarketData = ({ 
  stockData, 
  loading, 
  onStockSelect, 
  selectedStock, 
  onSignInPrompt 
}) => {
  const [hoveredStock, setHoveredStock] = useState(null);
  const { marketStatus, useSimulation } = useStockData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={48} />
        <span className="ml-4 text-gray-600">Loading live market data...</span>
      </div>
    );
  }

  const topStocks = Object.values(stockData).slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Market Status */}
      <MarketStatus 
        marketStatus={marketStatus} 
        useSimulation={useSimulation}
        stockCount={Object.keys(stockData).length}
      />

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topStocks.map(stock => {
          const isPositive = stock.change >= 0;
          const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
          const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
          const isSelected = selectedStock === stock.symbol;
          const isHovered = hoveredStock === stock.symbol;
          
          return (
            <div
              key={stock.symbol}
              className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => onStockSelect(stock.symbol)}
              onMouseEnter={() => setHoveredStock(stock.symbol)}
              onMouseLeave={() => setHoveredStock(null)}
            >
              {/* Trading Overlay on Hover */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSignInPrompt();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Lock size={18} className="mr-2" />
                    Sign In to Trade
                  </button>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                  </div>
                  <div className={`flex items-center ${changeColor}`}>
                    {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    <span className="text-sm font-semibold ml-1">
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-gray-900">
                      ${stock.price.toFixed(2)}
                    </span>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${bgColor} ${changeColor}`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>High: ${stock.high?.toFixed(2) || 'N/A'}</div>
                    <div>Low: ${stock.low?.toFixed(2) || 'N/A'}</div>
                  </div>
                </div>
                
                {/* Mini trend indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <TrendingUp size={14} className="mr-1" />
                    <span>{useSimulation ? 'Live Simulation' : 'Real-time data'}</span>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stock Chart */}
      {selectedStock && stockData[selectedStock] && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stockData[selectedStock].symbol} - {stockData[selectedStock].name}
              </h3>
              <p className="text-gray-600">
                {useSimulation ? 'Live price simulation with realistic market movements' : 'Real-time price chart and analysis'}
              </p>
            </div>
            <button
              onClick={onSignInPrompt}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            >
              <Lock size={18} className="mr-2" />
              Sign In to Start Trading
            </button>
          </div>
          
          <StockChart 
            stock={stockData[selectedStock]} 
            loading={false}
            compact={false}
          />
        </div>
      )}

      {/* Simulation Info */}
      {useSimulation && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Live Market Simulation
              </h3>
              <p className="text-green-700 text-sm">
                Experience realistic price movements based on actual market patterns. 
                Prices update every 2 seconds with authentic volatility and trends.
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <span>• Market session awareness</span>
                <span className="mx-2">•</span>
                <span>• Realistic volume patterns</span>
                <span className="mx-2">•</span>
                <span>• Price history tracking</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900">
                {Object.keys(stockData).length}
              </div>
              <div className="text-sm text-green-700">Stocks Simulated</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMarketData;