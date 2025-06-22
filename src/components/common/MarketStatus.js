// src/components/common/MarketStatus.js
import React from 'react';
import { Clock, TrendingUp, Activity, Zap } from 'lucide-react';

const MarketStatus = ({ marketStatus, useSimulation, stockCount }) => {
  if (!marketStatus) return null;

  const getStatusColor = (session) => {
    switch (session) {
      case 'opening':
      case 'closing':
        return 'text-orange-600 bg-orange-100';
      case 'midday':
        return 'text-green-600 bg-green-100';
      case 'premarket':
      case 'afterhours':
        return 'text-blue-600 bg-blue-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSessionName = (session) => {
    switch (session) {
      case 'opening': return 'Market Opening';
      case 'midday': return 'Market Open';
      case 'closing': return 'Market Closing';
      case 'premarket': return 'Pre-Market';
      case 'afterhours': return 'After Hours';
      case 'closed': return 'Market Closed';
      default: return 'Unknown';
    }
  };

  const getVolatilityLevel = (factor) => {
    if (factor >= 2) return { level: 'High', color: 'text-red-600', icon: Zap };
    if (factor >= 1.5) return { level: 'Elevated', color: 'text-orange-600', icon: TrendingUp };
    if (factor >= 1) return { level: 'Normal', color: 'text-green-600', icon: Activity };
    return { level: 'Low', color: 'text-gray-600', icon: Clock };
  };

  const volatility = getVolatilityLevel(marketStatus.volatilityFactor);
  const VolatilityIcon = volatility.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Market Status */}
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              marketStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {getSessionName(marketStatus.session)}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(marketStatus.session)}`}>
                {useSimulation ? 'Simulation Mode' : 'Live Data'}
              </div>
            </div>
          </div>

          {/* Volatility Indicator */}
          <div className="flex items-center">
            <VolatilityIcon size={16} className={`mr-1 ${volatility.color}`} />
            <div>
              <div className="text-sm font-medium text-gray-900">Volatility</div>
              <div className={`text-xs ${volatility.color}`}>
                {volatility.level} ({marketStatus.volatilityFactor.toFixed(1)}x)
              </div>
            </div>
          </div>

          {/* Stock Count */}
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-1 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Tracking</div>
              <div className="text-xs text-blue-600">
                {stockCount} stocks
              </div>
            </div>
          </div>
        </div>

        {/* Next Market Event */}
        <div className="text-right">
          <div className="text-xs text-gray-500">
            {marketStatus.isOpen ? 'Market closes at 4:00 PM EST' : 'Next open: 9:30 AM EST'}
          </div>
          {useSimulation && (
            <div className="text-xs text-green-600 font-medium">
              📊 Real-time simulation active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketStatus;