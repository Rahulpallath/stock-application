// src/components/trade/StockList.js
import React from 'react';
import { Loader } from 'lucide-react';

const StockList = ({ stockData, loading, searchTerm, selectedStock, onStockSelect }) => {
  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Stocks</h3>
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-center items-center h-48">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        </div>
      </div>
    );
  }

  const filteredStocks = Object.values(stockData).filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Stocks {searchTerm && `(${filteredStocks.length} results)`}
      </h3>
      
      <div className="bg-white rounded-lg shadow divide-y max-h-96 overflow-y-auto">
        {filteredStocks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No stocks found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredStocks.map(stock => (
            <div
              key={stock.symbol}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedStock === stock.symbol ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onStockSelect(stock.symbol)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{stock.symbol}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockList;