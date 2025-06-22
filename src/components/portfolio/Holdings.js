// src/components/portfolio/Holdings.js
import React from 'react';
import { Briefcase } from 'lucide-react';

const Holdings = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Holdings</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
          <p>No holdings yet. Start trading to build your portfolio!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Holdings</h3>
      </div>
      <div className="divide-y">
        {holdings.map(({ symbol, quantity, currentPrice, currentValue, profit, profitPercent, stock }) => (
          <div key={symbol} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">{symbol}</h4>
                <p className="text-sm text-gray-600">{stock.name}</p>
                <p className="text-sm text-gray-500">{quantity} shares @ ${currentPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${currentValue.toFixed(2)}</p>
                <p className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                </p>
                <p className={`text-xs ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({profitPercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holdings;