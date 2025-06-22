// src/components/home/WelcomeCard.js
import React from 'react';

const WelcomeCard = ({ userData }) => {
  const {
    name = 'User',
    totalValue = 0,
    cash = 0,
    portfolioValue = 0
  } = userData || {};

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Welcome back, {name}!</h2>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-blue-100">Total Value</p>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-blue-100">Cash Available</p>
          <p className="text-2xl font-semibold">${cash.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-blue-100">Portfolio Value</p>
          <p className="text-2xl font-semibold">${portfolioValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;