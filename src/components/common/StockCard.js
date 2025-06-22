// src/components/common/StockCard.js
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

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

  return (
    <div
      className={`bg-white border rounded-lg p-4 ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{symbol}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{name}</p>
        </div>
        <div className={`flex items-center ${changeColor}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="text-sm font-semibold ml-1">
            {changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-2xl font-bold">${price.toFixed(2)}</p>
        <p className={`text-sm ${changeColor}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}
        </p>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500 space-y-1">
          {high && <div>High: ${high.toFixed(2)}</div>}
          {low && <div>Low: ${low.toFixed(2)}</div>}
          {volume && <div>Volume: {volume.toLocaleString()}</div>}
        </div>
      )}
    </div>
  );
};

export default StockCard;