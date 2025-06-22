// src/components/public/StockChart.js
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Loader } from 'lucide-react';

const StockChart = ({ stock, loading, compact = false, getStockHistory = null, useSimulation = false }) => {
  
  // Get price history for the chart
  const chartData = useMemo(() => {
    if (!stock) return [];
    
    if (useSimulation && getStockHistory) {
      // Use real simulation history if available
      const history = getStockHistory(stock.symbol);
      if (history && history.length > 0) {
        return history.map((point, index) => ({
          date: new Date(point.time).toISOString().split('T')[0],
          price: point.price,
          volume: Math.floor(Math.random() * 50000000) + 1000000,
          index
        }));
      }
    }
    
    // Fallback: Generate chart data based on current price
    const data = [];
    const currentPrice = stock.price;
    const basePrice = stock.previousClose || currentPrice;
    
    // Generate 30 data points for the day
    for (let i = 0; i < 30; i++) {
      const progress = i / 29; // 0 to 1
      const timeVariation = Math.sin(progress * Math.PI * 2) * 0.01; // Sine wave variation
      const randomNoise = (Math.random() - 0.5) * 0.02; // Random noise
      const trendTowardsCurrent = progress * ((currentPrice - basePrice) / basePrice);
      
      const price = basePrice * (1 + trendTowardsCurrent + timeVariation + randomNoise);
      
      data.push({
        date: `Point ${i + 1}`,
        price: Math.max(0.01, price),
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        index: i
      });
    }
    
    // Ensure last point matches current price
    if (data.length > 0) {
      data[data.length - 1].price = currentPrice;
    }
    
    return data;
  }, [stock, useSimulation, getStockHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={32} />
        <span className="ml-2 text-gray-600">Loading chart...</span>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <BarChart3 size={48} className="mr-4 opacity-50" />
        <span>Select a stock to view chart</span>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const chartColor = isPositive ? '#10b981' : '#ef4444'; // green-500 : red-500
  const chartHeight = compact ? 200 : 300;

  // Calculate min and max for scaling
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Generate SVG path only if we have valid data
  let pathData = '';
  let areaData = '';
  
  if (chartData.length > 0 && priceRange > 0) {
    pathData = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = 100 - ((point.price - minPrice) / priceRange) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Generate area path for gradient fill
    areaData = `${pathData} L 100 100 L 0 100 Z`;
  }

  return (
    <div className="space-y-4">
      {/* Stock Info Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white`}>
            {stock.symbol}
          </h3>
          {!compact && (
            <p className="text-sm text-blue-200 truncate">{stock.name}</p>
          )}
        </div>
        <div className="text-right">
          <div className={`${compact ? 'text-xl' : 'text-3xl'} font-bold text-white`}>
            ${stock.price.toFixed(2)}
          </div>
          <div className={`flex items-center justify-end ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1 font-semibold">
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="border rounded-lg bg-white/10 backdrop-blur-sm"
        >
          {/* Grid lines */}
          <defs>
            <pattern id={`grid-${stock.symbol}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id={`areaGradient-${stock.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={chartColor} stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          <rect width="100" height="100" fill={`url(#grid-${stock.symbol})`} />
          
          {/* Area fill */}
          {areaData && (
            <path
              d={areaData}
              fill={`url(#areaGradient-${stock.symbol})`}
            />
          )}
          
          {/* Price line */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={chartColor}
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          )}
          
          {/* Data points */}
          {!compact && chartData.length > 0 && priceRange > 0 && chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 100 - ((point.price - minPrice) / priceRange) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="0.5"
                fill={chartColor}
                className="opacity-60"
              />
            );
          })}
        </svg>
        
        {/* Price labels */}
        <div className="absolute top-2 left-2 text-xs text-white/80 bg-black/20 px-2 py-1 rounded">
          High: ${maxPrice.toFixed(2)}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/20 px-2 py-1 rounded">
          Low: ${minPrice.toFixed(2)}
        </div>
        
        {/* Live indicator */}
        {useSimulation && (
          <div className="absolute top-2 right-2 flex items-center text-xs text-white/80 bg-black/20 px-2 py-1 rounded">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
            Live Simulation
          </div>
        )}
      </div>

      {/* Chart Stats */}
      {!compact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-blue-200">Open</div>
            <div className="font-semibold">${stock.open?.toFixed(2) || stock.previousClose?.toFixed(2) || 'N/A'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-blue-200">High</div>
            <div className="font-semibold">${(stock.high || maxPrice).toFixed(2)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-blue-200">Low</div>
            <div className="font-semibold">${(stock.low || minPrice).toFixed(2)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-blue-200">Volume</div>
            <div className="font-semibold">
              {stock.volume ? (stock.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
            </div>
          </div>
        </div>
      )}
      
      {/* Time period selector (for display only) */}
      {!compact && (
        <div className="flex justify-center space-x-2">
          {['1D', '5D', '1M', '3M', '1Y'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                period === '1D' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              disabled
            >
              {period}
            </button>
          ))}
        </div>
      )}
      
      {/* Chart info */}
      {!compact && useSimulation && (
        <div className="text-center text-white/60 text-sm">
          📊 Real-time price simulation • Updates every 2 seconds
        </div>
      )}
    </div>
  );
};

export default StockChart;