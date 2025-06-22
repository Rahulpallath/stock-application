// src/components/home/WelcomeCard.js
import React from 'react';
import { TrendingUp, DollarSign, PieChart } from 'lucide-react';

const WelcomeCard = ({ userData }) => {
  const {
    name = 'User',
    totalValue = 0,
    cash = 0,
    portfolioValue = 0
  } = userData || {};

  const portfolioPercent = totalValue > 0 ? (portfolioValue / totalValue) * 100 : 0;
  const cashPercent = totalValue > 0 ? (cash / totalValue) * 100 : 100;

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl p-4 sm:p-6 text-white shadow-xl">
      {/* Welcome Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, 
          <span className="block sm:inline sm:ml-2 text-blue-200">{name}!</span>
        </h2>
        <p className="text-blue-100 text-sm opacity-90">
          Track your portfolio performance and manage your investments
        </p>
      </div>

      {/* Mobile Stats Layout */}
      <div className="sm:hidden space-y-4">
        {/* Total Value - Prominent */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp size={20} className="text-blue-200 mr-2" />
            <span className="text-blue-200 text-sm font-medium">Total Portfolio Value</span>
          </div>
          <div className="text-3xl font-bold">${totalValue.toFixed(2)}</div>
        </div>

        {/* Cash and Portfolio - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign size={16} className="text-green-300 mr-1" />
              <span className="text-blue-200 text-xs">Cash</span>
            </div>
            <div className="text-lg font-bold">${cash.toFixed(0)}</div>
            <div className="text-xs text-blue-300">{cashPercent.toFixed(0)}%</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <PieChart size={16} className="text-purple-300 mr-1" />
              <span className="text-blue-200 text-xs">Invested</span>
            </div>
            <div className="text-lg font-bold">${portfolioValue.toFixed(0)}</div>
            <div className="text-xs text-blue-300">{portfolioPercent.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Desktop Stats Layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp size={20} className="text-blue-200 mr-2" />
              <span className="text-blue-200 text-sm font-medium">Total Value</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold">${totalValue.toFixed(2)}</div>
            <div className="text-xs text-blue-300 mt-1">Portfolio Balance</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign size={20} className="text-green-300 mr-2" />
              <span className="text-blue-200 text-sm font-medium">Cash Available</span>
            </div>
            <div className="text-xl lg:text-2xl font-semibold">${cash.toFixed(2)}</div>
            <div className="text-xs text-blue-300 mt-1">{cashPercent.toFixed(1)}% of total</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <PieChart size={20} className="text-purple-300 mr-2" />
              <span className="text-blue-200 text-sm font-medium">Portfolio Value</span>
            </div>
            <div className="text-xl lg:text-2xl font-semibold">${portfolioValue.toFixed(2)}</div>
            <div className="text-xs text-blue-300 mt-1">{portfolioPercent.toFixed(1)}% invested</div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation Bar */}
      {totalValue > 0 && (
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between text-xs text-blue-200 mb-2">
            <span>Allocation</span>
            <span>{portfolioValue > 0 ? `${portfolioPercent.toFixed(1)}% invested` : '100% cash'}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${portfolioPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-blue-300 mt-1">
            <span>Cash: ${cash.toFixed(0)}</span>
            <span>Invested: ${portfolioValue.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeCard;