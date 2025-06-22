// src/components/portfolio/PortfolioStats.js
import React from 'react';
import { TrendingUp, TrendingDown, Briefcase, Activity } from 'lucide-react';

const PortfolioStats = ({ stats }) => {
  const {
    portfolioValue = 0,
    totalCost = 0,
    totalProfit = 0,
    totalProfitPercent = 0,
    holdingsCount = 0,
    transactionsCount = 0
  } = stats || {};

  const isPositive = totalProfit >= 0;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Mobile: 2x2 Grid, Desktop: 2x3 Grid */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portfolio Value */}
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-xs text-blue-600 mb-1">Portfolio Value</div>
            <div className="text-lg lg:text-xl font-bold text-blue-900">
              ${portfolioValue.toLocaleString()}
            </div>
          </div>
          
          {/* Total P&L */}
          <div className={`rounded-lg p-4 text-center ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-center mb-1">
              {isPositive ? (
                <TrendingUp className="text-green-600 mr-1" size={12} />
              ) : (
                <TrendingDown className="text-red-600 mr-1" size={12} />
              )}
              <div className="text-xs">Total P&L</div>
            </div>
            <div className={`text-lg lg:text-xl font-bold ${isPositive ? 'text-green-900' : 'text-red-900'}`}>
              {isPositive ? '+' : ''}${totalProfit.toLocaleString()}
            </div>
            <div className={`text-xs ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              ({totalProfitPercent.toFixed(1)}%)
            </div>
          </div>
          
          {/* Holdings Count */}
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Briefcase className="text-purple-600 mr-1" size={12} />
              <div className="text-xs text-purple-600">Holdings</div>
            </div>
            <div className="text-lg lg:text-xl font-bold text-purple-900">{holdingsCount}</div>
          </div>
          
          {/* Transactions Count */}
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="text-orange-600 mr-1" size={12} />
              <div className="text-xs text-orange-600">Trades</div>
            </div>
            <div className="text-lg lg:text-xl font-bold text-orange-900">{transactionsCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;