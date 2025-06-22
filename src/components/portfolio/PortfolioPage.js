// src/components/portfolio/PortfolioPage.js
import React from 'react';
import { Briefcase } from 'lucide-react';
import Holdings from './Holdings';
import TransactionHistory from './TransactionHistory';
import PortfolioStats from './PortfolioStats';

const PortfolioPage = ({ holdings, transactions, portfolioStats, stockData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Portfolio</h2>
        <PortfolioStats stats={portfolioStats} />
      </div>
      
      <Holdings holdings={holdings} />
      
      <TransactionHistory transactions={transactions} stockData={stockData} />
    </div>
  );
};

export default PortfolioPage;