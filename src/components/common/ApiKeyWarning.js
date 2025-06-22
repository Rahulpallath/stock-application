import React, { useState } from 'react';
import { AlertCircle, X, Wifi, WifiOff } from 'lucide-react';

const ApiKeyWarning = ({ dataInfo }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  // Check if API key exists
  const hasApiKey = () => {
    const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
    return apiKey && apiKey !== 'YOUR_FINNHUB_API_KEY' && apiKey.trim() !== '';
  };

  // If we have an API key but no real data, show rate limit message
  if (hasApiKey() && dataInfo && !dataInfo.hasRealData) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex items-center mr-3">
            <WifiOff className="text-orange-400" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-orange-700">
              <strong>API Rate Limited:</strong> Real-time data temporarily unavailable.
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Using realistic simulation mode. Real data will be available after rate limits reset.
            </p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-orange-400 hover:text-orange-600 ml-2 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Show demo mode warning if no API key
  if (!hasApiKey()) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex items-center mr-3">
            <AlertCircle className="text-yellow-400" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-yellow-700">
              <strong>Demo Mode:</strong> Using simulated data. To use real-time data:
            </p>
            <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
              <li>Get a free API key from <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">finnhub.io</a></li>
              <li>Add your API key to the .env file as REACT_APP_FINNHUB_API_KEY</li>
              <li>Restart the app with npm start</li>
            </ol>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-yellow-400 hover:text-yellow-600 ml-2 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ApiKeyWarning;