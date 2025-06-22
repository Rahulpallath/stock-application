// src/components/common/DataSourceIndicator.js
import React, { useState } from 'react';
import { 
  Wifi, 
  Activity, 
  Clock, 
  RefreshCw, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const DataSourceIndicator = ({ dataInfo, onRefresh, compact = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!dataInfo) return null;

  const getStatusIcon = () => {
    if (dataInfo.hasRealData) {
      return <CheckCircle size={16} className="text-green-600" />;
    } else {
      return <Activity size={16} className="text-blue-600" />;
    }
  };

  const getStatusText = () => {
    if (dataInfo.hasRealData) {
      return `Real prices + Live simulation (${dataInfo.realDataCount}/${dataInfo.totalStocks})`;
    } else {
      return 'Live simulation mode';
    }
  };

  const getStatusColor = () => {
    return dataInfo.hasRealData 
      ? 'border-green-200 bg-green-50' 
      : 'border-blue-200 bg-blue-50';
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="ml-2 text-sm font-medium">
          {dataInfo.hasRealData ? 'Real + Sim' : 'Simulation'}
        </span>
        <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <div className="font-medium text-gray-900">
              {getStatusText()}
            </div>
            <div className="text-sm text-gray-600">
              {dataInfo.message}
            </div>
          </div>
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
            title="Show details"
          >
            {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Data Source</div>
              <div className="font-medium">
                {dataInfo.hasRealData ? 'Hybrid' : 'Simulation Only'}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Real Stocks</div>
              <div className="font-medium">
                {dataInfo.realDataCount || 0} / {dataInfo.totalStocks}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Last Update</div>
              <div className="font-medium">
                {dataInfo.lastUpdate || 'Just now'}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Cache Status</div>
              <div className="font-medium">
                {dataInfo.cacheValid ? 'Valid' : 'Expired'}
              </div>
            </div>
          </div>

          {dataInfo.hasRealData && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <div className="flex items-start">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5" />
                <div className="text-sm text-green-800">
                  <strong>Real market prices loaded!</strong> Your simulation is now running with 
                  authentic starting prices from {dataInfo.realDataCount} stocks. Prices update 
                  every 2 seconds with realistic market movements.
                </div>
              </div>
            </div>
          )}

          {!dataInfo.hasRealData && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <div className="flex items-start">
                <Info size={16} className="text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Simulation mode:</strong> Using realistic price movements based on 
                  market patterns. Add your Finnhub API key to load real starting prices.
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-gray-500">
            💡 <strong>How it works:</strong> We fetch real prices once when you load the app, 
            then use intelligent simulation to provide unlimited real-time updates without 
            API rate limits.
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourceIndicator;