// src/components/trade/TradingPanel.js
import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

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

  const isPositive = stock.change >= 0;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Trade</h3>
      <div className="bg-white rounded-lg shadow">
        {/* Mobile-optimized stock header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-bold text-xl text-gray-900">{selectedStock}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{stock.name}</p>
            </div>
            <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-semibold ml-1">
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          {/* Price display */}
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-gray-900">${stock.price.toFixed(2)}</div>
            <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Order Type Buttons - Mobile Optimized */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">Order Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-4 px-4 rounded-lg font-semibold text-lg transition-all ${
                  orderType === 'buy' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </button>
              <button
                className={`py-4 px-4 rounded-lg font-semibold text-lg transition-all ${
                  orderType === 'sell' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Quantity Input - Mobile Optimized */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Quantity
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                className="flex-1 p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                placeholder="0"
                min="0"
                max={getMaxQuantity()}
                inputMode="numeric"
              />
              <button
                className="px-4 py-4 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium min-w-[60px]"
                onClick={() => setOrderQuantity(getMaxQuantity().toString())}
              >
                Max
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Maximum: {getMaxQuantity().toLocaleString()} shares
            </div>
          </div>

          {/* Order Summary - Mobile Card Layout */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Price per Share</div>
                <div className="font-semibold text-gray-900">${stock.price.toFixed(2)}</div>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Quantity</div>
                <div className="font-semibold text-gray-900">{quantity}</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Total</span>
                <span className="font-bold text-lg text-gray-900">${totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Cash</span>
                <span className="font-semibold text-gray-900">${(userData?.cash || 0).toLocaleString()}</span>
              </div>
              
              {orderType === 'sell' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Owned Shares</span>
                  <span className="font-semibold text-gray-900">{userShares.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {!isTradeValid() && quantity > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-700 font-medium">
                  {orderType === 'buy' && !canAfford && '⚠️ Insufficient funds'}
                  {orderType === 'sell' && !hasShares && '⚠️ Insufficient shares'}
                </div>
              </div>
            )}
          </div>
          
          {/* Trade Button - Large and Touch-Friendly */}
          <button
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              isTradeValid()
                ? orderType === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleTrade}
            disabled={!isTradeValid()}
          >
            {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedStock}
            {isTradeValid() && (
              <div className="text-sm opacity-90 mt-1">
                ${totalCost.toFixed(2)}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;