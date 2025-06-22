// src/components/common/StockCard.js
import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const StockCard = ({ stock, onClick, className = '', showDetails = false }) => {
  const {
    symbol,
    name,
    price = 0,
    change = 0,
    changePercent = 0,
    high,
    low,
    volume
  } = stock;

  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div
      className={`bg-white border rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xl sm:text-2xl text-gray-900">{symbol}</h4>
          <p className="text-sm text-gray-600 truncate">{name}</p>
        </div>
        <div className={`flex items-center ${changeColor} ml-2`}>
          {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          <span className="text-sm font-semibold ml-1">
            {changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      
      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl sm:text-4xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${changeColor}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Details Section - Enhanced for Mobile */}
      {showDetails && (
        <div className="space-y-3">
          {/* High/Low Row */}
          {(high || low) && (
            <div className="grid grid-cols-2 gap-3">
              {high && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">High</div>
                  <div className="font-semibold text-gray-900">${high.toFixed(2)}</div>
                </div>
              )}
              {low && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Low</div>
                  <div className="font-semibold text-gray-900">${low.toFixed(2)}</div>
                </div>
              )}
            </div>
          )}
          
          {/* Volume */}
          {volume && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Volume</div>
                <div className="font-semibold text-gray-900">
                  {volume > 1000000 ? `${(volume / 1000000).toFixed(1)}M` : volume.toLocaleString()}
                </div>
              </div>
            </div>
          )}
          
          {/* Live Indicator */}
          <div className="flex items-center justify-center text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <TrendingUp size={12} className="mr-1" />
            Live Simulation
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;