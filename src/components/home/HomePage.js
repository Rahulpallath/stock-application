import React from 'react';
import WelcomeCard from './WelcomeCard';
import MarketMovers from './MarketMovers';
import ApiKeyWarning from '../common/ApiKeyWarning';

const HomePage = ({ 
  userData, 
  stockData, 
  loading, 
  apiKeyMissing, 
  onStockSelect,
  dataInfo
}) => {
  // Only show warning if:
  // 1. Not currently loading AND
  // 2. We have tried to fetch data (dataInfo.fetchAttempted) AND
  // 3. API key is actually missing
  const shouldShowWarning = !loading && 
                           dataInfo?.fetchAttempted && 
                           apiKeyMissing;

  return (
    <div className="space-y-6">
      {shouldShowWarning && <ApiKeyWarning dataInfo={dataInfo} />}
      
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