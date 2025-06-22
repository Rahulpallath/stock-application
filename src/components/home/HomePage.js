// src/components/home/HomePage.js
import React from 'react';
import WelcomeCard from './WelcomeCard';
import MarketMovers from './MarketMovers';
import ApiKeyWarning from '../common/ApiKeyWarning';

const HomePage = ({ 
  userData, 
  stockData, 
  loading, 
  apiKeyMissing, 
  onStockSelect 
}) => {
  return (
    <div className="space-y-6">
      {apiKeyMissing && <ApiKeyWarning />}
      
      <WelcomeCard userData={userData} />
      
      <MarketMovers 
        stockData={stockData}
        loading={loading}
        onStockSelect={onStockSelect}
      />
    </div>
  );
};

export default HomePage;