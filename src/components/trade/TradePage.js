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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockList
            stockData={stockData}
            loading={loading}
            searchTerm={searchTerm}
            selectedStock={selectedStock}
            onStockSelect={onStockSelect}
          />
        </div>

        <div>
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