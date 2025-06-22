// src/components/portfolio/PortfolioStats.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Portfolio Value</p>
          <p className="text-2xl font-bold">${portfolioValue.toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Total P&L</p>
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="text-green-600 mr-1" size={16} />
            ) : (
              <TrendingDown className="text-red-600 mr-1" size={16} />
            )}
            <div>
              <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}${totalProfit.toFixed(2)}
              </p>
              <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                ({totalProfitPercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Holdings</p>
          <p className="text-lg font-semibold">{holdingsCount}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="text-lg font-semibold">{transactionsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;