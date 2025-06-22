// src/components/portfolio/Holdings.js
import React from 'react';
import { Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

const Holdings = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Holdings</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">No holdings yet. Start trading to build your portfolio!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Holdings</h3>
        <p className="text-xs text-gray-500 mt-1">{holdings.length} position{holdings.length !== 1 ? 's' : ''}</p>
      </div>
      
      {/* Mobile Card Layout */}
      <div className="divide-y divide-gray-100">
        {holdings.map(({ symbol, quantity, currentPrice, currentValue, profit, profitPercent, stock }) => {
          const isPositive = profit >= 0;
          
          return (
            <div key={symbol} className="p-4 hover:bg-gray-50 transition-colors">
              {/* Mobile Layout */}
              <div className="sm:hidden">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{symbol}</h4>
                    <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                  </div>
                  <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-semibold ml-1">
                      {profitPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Shares</div>
                    <div className="font-semibold text-gray-900">{quantity}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Price</div>
                    <div className="font-semibold text-gray-900">${currentPrice.toFixed(2)}</div>
                  </div>
                </div>

                {/* Value and P&L */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-500">Market Value</div>
                    <div className="font-bold text-lg text-gray-900">${currentValue.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">P&L</div>
                    <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}${profit.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{symbol}</h4>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{stock.name}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {quantity} shares @ ${currentPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-semibold text-lg text-gray-900">${currentValue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Market Value</div>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className={`font-semibold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}${profit.toFixed(2)}
                    </div>
                    <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      ({profitPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Holdings;