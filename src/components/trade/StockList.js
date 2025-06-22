// src/components/trade/StockList.js
import React from 'react';
import { Loader, TrendingUp, TrendingDown } from 'lucide-react';

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
      
      {/* Mobile Grid Layout */}
      <div className="space-y-3 sm:space-y-0">
        {/* Desktop List View */}
        <div className="hidden sm:block bg-white rounded-lg shadow divide-y max-h-96 overflow-y-auto">
          {filteredStocks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No stocks found matching "{searchTerm}"</p>
            </div>
          ) : (
            filteredStocks.map(stock => {
              const isPositive = stock.change >= 0;
              return (
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
                      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Card Grid */}
        <div className="sm:hidden grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {filteredStocks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>No stocks found matching "{searchTerm}"</p>
            </div>
          ) : (
            filteredStocks.map(stock => {
              const isPositive = stock.change >= 0;
              return (
                <div
                  key={stock.symbol}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedStock === stock.symbol ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => onStockSelect(stock.symbol)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">{stock.symbol}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{stock.name}</p>
                    </div>
                    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="text-sm font-semibold ml-1">
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-900">${stock.price.toFixed(2)}</div>
                    <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                    </div>
                  </div>
                  
                  {selectedStock === stock.symbol && (
                    <div className="mt-3 pt-3 border-t border-blue-100">
                      <div className="text-center text-blue-600 text-sm font-medium">
                        Selected for Trading
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StockList;