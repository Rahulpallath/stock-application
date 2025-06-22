// src/components/portfolio/PortfolioPage.js
import React from 'react';
import Holdings from './Holdings';
import TransactionHistory from './TransactionHistory';
import PortfolioStats from './PortfolioStats';

const PortfolioPage = ({ holdings, transactions, portfolioStats, stockData }) => {
  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">My Portfolio</h2>
        <PortfolioStats stats={portfolioStats} />
      </div>
      
      {/* Holdings Section */}
      <Holdings holdings={holdings} />
      
      {/* Transaction History */}
      <TransactionHistory transactions={transactions} stockData={stockData} />
    </div>
  );
};

export default PortfolioPage;