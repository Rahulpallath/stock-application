// src/components/trade/TradingPanel.js
import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const TradingPanel = ({ selectedStock, stockData, userData, portfolio, onTrade }) => {
  const [orderType, setOrderType] = useState('buy');
  const [orderQuantity, setOrderQuantity] = useState('');

  if (!selectedStock) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Trade</h3>
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <Activity size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a stock to trade</p>
        </div>
      </div>
    );
  }

  const stock = stockData[selectedStock];
  if (!stock) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Trade</h3>
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>Stock data not available</p>
        </div>
      </div>
    );
  }

  const quantity = parseInt(orderQuantity) || 0;
  const totalCost = stock.price * quantity;
  const userShares = portfolio[selectedStock] || 0;
  const canAfford = userData?.cash >= totalCost;
  const hasShares = userShares >= quantity;

  const handleTrade = () => {
    if (!orderQuantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    const success = onTrade(selectedStock, quantity, orderType);
    if (success) {
      setOrderQuantity('');
    }
  };

  const getMaxQuantity = () => {
    if (orderType === 'buy') {
      return Math.floor((userData?.cash || 0) / stock.price);
    } else {
      return userShares;
    }
  };

  const isTradeValid = () => {
    if (quantity <= 0) return false;
    if (orderType === 'buy') return canAfford;
    if (orderType === 'sell') return hasShares;
    return false;
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Trade</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h4 className="font-bold text-lg">{selectedStock}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{stock.name}</p>
          <p className="text-2xl font-bold mt-2">${stock.price.toFixed(2)}</p>
          <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`py-2 px-4 rounded font-medium transition-colors ${
                  orderType === 'buy' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </button>
              <button
                className={`py-2 px-4 rounded font-medium transition-colors ${
                  orderType === 'sell' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quantity
              <span className="text-gray-500 text-xs ml-1">
                (Max: {getMaxQuantity()})
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                placeholder="0"
                min="0"
                max={getMaxQuantity()}
              />
              <button
                className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                onClick={() => setOrderQuantity(getMaxQuantity().toString())}
              >
                Max
              </button>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price per share</span>
              <span className="font-semibold">${stock.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quantity</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Total</span>
              <span className="font-semibold text-lg">${totalCost.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Cash</span>
              <span className="font-semibold">${(userData?.cash || 0).toFixed(2)}</span>
            </div>
            
            {orderType === 'sell' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Owned Shares</span>
                <span className="font-semibold">{userShares}</span>
              </div>
            )}
            
            {!isTradeValid() && quantity > 0 && (
              <div className="text-sm text-red-600 mt-2">
                {orderType === 'buy' && !canAfford && 'Insufficient funds'}
                {orderType === 'sell' && !hasShares && 'Insufficient shares'}
              </div>
            )}
          </div>
          
          <button
            className={`w-full py-3 rounded font-semibold transition-colors ${
              isTradeValid()
                ? orderType === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleTrade}
            disabled={!isTradeValid()}
          >
            {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedStock}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;