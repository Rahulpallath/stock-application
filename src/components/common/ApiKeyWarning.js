// src/components/common/ApiKeyWarning.js
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ApiKeyWarning = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      <div className="flex">
        <AlertCircle className="text-yellow-400 mr-3 mt-1" size={20} />
        <div>
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode:</strong> Using simulated data. To use real-time data:
          </p>
          <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
            <li>Get a free API key from <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">finnhub.io</a></li>
            <li>Add your API key to the .env file as REACT_APP_FINNHUB_API_KEY</li>
            <li>Restart the app with npm start</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarning;