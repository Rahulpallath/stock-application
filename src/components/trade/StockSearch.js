// src/components/trade/StockSearch.js
import React from 'react';
import { Search, X } from 'lucide-react';

const StockSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg shadow border border-gray-200 p-4">
        <Search className="text-gray-400 mr-3" size={20} />
        <input
          type="text"
          placeholder="Search stocks..."
          className="flex-1 text-lg placeholder-gray-500 outline-none"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StockSearch;