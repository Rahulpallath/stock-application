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
  EyeOff,
  ChevronDown,
  ChevronUp
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
      return `Real + Simulation (${dataInfo.realDataCount}/${dataInfo.totalStocks})`;
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
      <div className={`inline-flex items-center px-3 py-2 rounded-full border ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="ml-2 text-sm font-medium hidden sm:inline">
          {dataInfo.hasRealData ? 'Real + Sim' : 'Simulation'}
        </span>
        <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg ${getStatusColor()}`}>
      {/* Main Status Bar */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 text-sm sm:text-base">
                {getStatusText()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 truncate">
                {dataInfo.message}
              </div>
            </div>
            <div className="flex items-center text-green-600 ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs sm:text-sm font-medium">Live</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {/* Mobile: Combined button */}
            <div className="sm:hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
              >
                {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            {/* Desktop: Separate buttons */}
            <div className="hidden sm:flex items-center space-x-2">
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
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-4 space-y-4">
            {/* Stats Grid - Mobile Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 text-xs">Data Source</div>
                <div className="font-medium">
                  {dataInfo.hasRealData ? 'Hybrid' : 'Simulation'}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 text-xs">Real Stocks</div>
                <div className="font-medium">
                  {dataInfo.realDataCount || 0} / {dataInfo.totalStocks}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 text-xs">Last Update</div>
                <div className="font-medium">
                  {dataInfo.lastUpdate || 'Just now'}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 text-xs">Cache Status</div>
                <div className="font-medium">
                  {dataInfo.cacheValid ? 'Valid' : 'Expired'}
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {dataInfo.hasRealData && (
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <strong>Real market prices loaded!</strong> Your simulation is now running with 
                    authentic starting prices from {dataInfo.realDataCount} stocks. Prices update 
                    every 2 seconds with realistic market movements.
                  </div>
                </div>
              </div>
            )}

            {!dataInfo.hasRealData && (
              <div className="p-3 bg-blue-100 rounded-lg">
                <div className="flex items-start">
                  <Info size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <strong>Simulation mode:</strong> Using realistic price movements based on 
                    market patterns. Add your Finnhub API key to load real starting prices.
                  </div>
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="text-xs text-gray-500 bg-white rounded-lg p-3">
              💡 <strong>How it works:</strong> We fetch real prices once when you load the app, 
              then use intelligent simulation to provide unlimited real-time updates without 
              API rate limits.
            </div>
            
            {/* Mobile refresh button */}
            <div className="sm:hidden">
              <button
                onClick={onRefresh}
                className="w-full p-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourceIndicator;