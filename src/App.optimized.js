import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { TrendingUp, TrendingDown, Search, Home, Briefcase, Activity, User, ArrowUpRight, ArrowDownRight, AlertCircle, Loader } from 'lucide-react';

// Memoized Stock Card Component
const StockCard = memo(({ stock, onClick }) => (
  <div
    className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={() => onClick(stock.symbol)}
  >
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold">{stock.symbol}</h4>
        <p className="text-sm text-gray-600">{stock.name}</p>
      </div>
      <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {stock.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span className="text-sm font-semibold">
          {stock.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
    <div className="mt-2">
      <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
    </div>
  </div>
));

// Add React.memo to prevent unnecessary re-renders