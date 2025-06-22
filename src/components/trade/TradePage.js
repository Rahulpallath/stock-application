// src/components/trade/TradePage.js
import React, { useState } from 'react';
import StockSearch from './StockSearch';
import StockList from './StockList';
import TradingPanel from './TradingPanel';

const TradePage = ({ 
  stockData, 
  loading, 
  selectedStock, 
  onStockSelect, 
  userData, 
  portfolio, 
  onTrade 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <StockSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Mobile: Stack layout, Desktop: Side-by-side */}
      <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Stock List */}
        <div className="lg:col-span-2">
          <StockList
            stockData={stockData}
            loading={loading}
            searchTerm={searchTerm}
            selectedStock={selectedStock}
            onStockSelect={onStockSelect}
          />
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <TradingPanel
            selectedStock={selectedStock}
            stockData={stockData}
            userData={userData}
            portfolio={portfolio}
            onTrade={onTrade}
          />
        </div>
      </div>
    </div>
  );
};

export default TradePage;