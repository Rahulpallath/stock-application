// src/components/portfolio/TransactionHistory.js
import React from 'react';
import { Clock } from 'lucide-react';

const TransactionHistory = ({ transactions, stockData }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Transactions</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Recent Transactions</h3>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {transactions.slice(0, 20).map(transaction => {
          const currentPrice = stockData[transaction.symbol]?.price || transaction.price;
          const priceChange = currentPrice - transaction.price;
          const priceChangePercent = ((priceChange / transaction.price) * 100);
          
          return (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded font-semibold ${
                      transaction.type === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type.toUpperCase()}
                    </span>
                    <span className="font-semibold">{transaction.symbol}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>{transaction.quantity} shares @ ${transaction.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                  </div>
                  
                  {currentPrice !== transaction.price && (
                    <div className="text-xs mt-1">
                      <span className="text-gray-500">Current: ${currentPrice.toFixed(2)} </span>
                      <span className={priceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ({priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">${transaction.total.toFixed(2)}</p>
                  {transaction.type === 'buy' && currentPrice !== transaction.price && (
                    <p className="text-xs text-gray-500">
                      Now: ${(currentPrice * transaction.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;