// src/components/trade/StockSearch.js
import React from 'react';
import { Search } from 'lucide-react';

const StockSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <Search className="text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search stocks by symbol or company name..."
        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default StockSearch;