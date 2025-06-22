// src/components/home/MarketMovers.js
import React from 'react';
import { Loader } from 'lucide-react';
import StockCard from '../common/StockCard';

const MarketMovers = ({ stockData, loading, onStockSelect }) => {
  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Market Movers</h3>
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  const topStocks = Object.values(stockData).slice(0, 6);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Market Movers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topStocks.map(stock => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onClick={() => onStockSelect(stock.symbol)}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default MarketMovers;