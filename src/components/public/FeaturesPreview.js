// src/components/public/FeaturesPreview.js
import React, { useState } from 'react';
import { PieChart, TrendingUp, BarChart3, Target, Lock, Play } from 'lucide-react';

const FeaturesPreview = ({ onSignInPrompt }) => {
  const [activeFeature, setActiveFeature] = useState('portfolio');

  const features = {
    portfolio: {
      title: 'Portfolio Management',
      description: 'Track your investments with detailed analytics and performance metrics',
      image: '/api/placeholder/600/400',
      benefits: [
        'Real-time portfolio valuation',
        'Profit/loss tracking per stock',
        'Diversification analysis',
        'Performance vs market benchmarks'
      ]
    },
    trading: {
      title: 'Smart Trading Interface',
      description: 'Execute trades with professional-grade tools and real-time market data',
      image: '/api/placeholder/600/400',
      benefits: [
        'One-click buy/sell orders',
        'Real-time price alerts',
        'Advanced order types',
        'Market depth analysis'
      ]
    },
    analytics: {
      title: 'Advanced Analytics',
      description: 'Make informed decisions with comprehensive market analysis and insights',
      image: '/api/placeholder/600/400',
      benefits: [
        'Technical indicator charts',
        'Price trend analysis',
        'Volume pattern recognition',
        'Risk assessment tools'
      ]
    }
  };

  const MockPortfolioWidget = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center z-10">
        <button
          onClick={onSignInPrompt}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center text-lg"
        >
          <Lock size={24} className="mr-3" />
          Sign In to Access
        </button>
      </div>
      
      {/* Mock Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">My Portfolio</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Total Value</div>
            <div className="text-2xl font-bold text-blue-900">$12,450</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">Today's Gain</div>
            <div className="text-2xl font-bold text-green-900">+$245</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">Total Return</div>
            <div className="text-2xl font-bold text-purple-900">+24.5%</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {['AAPL', 'GOOGL', 'MSFT', 'TSLA'].map((symbol, index) => (
            <div key={symbol} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">{symbol}</div>
                <div className="text-sm text-gray-600">{10 + index * 5} shares</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${(Math.random() * 3000 + 1000).toFixed(2)}</div>
                <div className="text-sm text-green-600">+{(Math.random() * 10).toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MockTradingWidget = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center z-10">
        <button
          onClick={onSignInPrompt}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center text-lg"
        >
          <Play size={24} className="mr-3" />
          Start Trading
        </button>
      </div>
      
      {/* Mock Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Trade AAPL</h3>
          <div className="text-2xl font-bold text-gray-900">$175.43</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-green-600 text-white py-3 rounded-lg font-semibold">
            Buy
          </button>
          <button className="bg-red-600 text-white py-3 rounded-lg font-semibold">
            Sell
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input 
              type="number" 
              placeholder="10" 
              className="w-full p-2 border rounded-lg bg-gray-50"
              disabled
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Est. Total:</span>
              <span className="font-semibold">$1,754.30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Available Cash:</span>
              <span className="font-semibold">$8,245.70</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MockAnalyticsWidget = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center z-10">
        <button
          onClick={onSignInPrompt}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center text-lg"
        >
          <BarChart3 size={24} className="mr-3" />
          View Analytics
        </button>
      </div>
      
      {/* Mock Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Market Analysis</h3>
        
        {/* Mock Chart */}
        <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end justify-around p-4">
          {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
            <div
              key={index}
              className="bg-blue-500 rounded-t w-8"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600">RSI</div>
            <div className="text-lg font-bold text-blue-900">67.5</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600">MA(50)</div>
            <div className="text-lg font-bold text-green-900">$172.80</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Support Level:</span>
            <span className="font-semibold text-green-600">$170.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Resistance Level:</span>
            <span className="font-semibold text-red-600">$180.00</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Professional Trading Tools
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need to succeed in the stock market
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {Object.entries(features).map(([key, feature]) => (
            <button
              key={key}
              onClick={() => setActiveFeature(key)}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === key
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {key === 'portfolio' && <PieChart size={20} className="mr-2" />}
              {key === 'trading' && <TrendingUp size={20} className="mr-2" />}
              {key === 'analytics' && <BarChart3 size={20} className="mr-2" />}
              {feature.title}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {features[activeFeature].title}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {features[activeFeature].description}
            </p>
          </div>
          
          <div className="space-y-3">
            {features[activeFeature].benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Target className="text-green-500 mr-3" size={20} />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          
          <button
            onClick={onSignInPrompt}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Try It Free
            <Target className="ml-2" size={20} />
          </button>
        </div>
        
        <div>
          {activeFeature === 'portfolio' && <MockPortfolioWidget />}
          {activeFeature === 'trading' && <MockTradingWidget />}
          {activeFeature === 'analytics' && <MockAnalyticsWidget />}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPreview;