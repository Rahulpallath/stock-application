// src/components/layout/Header.js
import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import SettingsDropdown from '../common/SettingsDropdown';

const Header = ({ 
  user, 
  userData, 
  onSignOut, 
  onExportData, 
  onImportData, 
  onResetData 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">StockSim</h1>
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-xs text-gray-500">Cash</div>
                <div className="font-semibold text-gray-900">${(userData?.cash || 0).toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Portfolio</div>
                <div className="font-semibold text-gray-900">${(userData?.portfolioValue || 0).toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-bold text-lg text-blue-600">${(userData?.totalValue || 0).toFixed(0)}</div>
              </div>
            </div>
            
            <SettingsDropdown
              onExportData={onExportData}
              onImportData={onImportData}
              onResetData={onResetData}
              onSignOut={onSignOut}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            {/* Mobile Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Cash</div>
                <div className="font-semibold text-gray-900 text-sm">${(userData?.cash || 0).toFixed(0)}</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Portfolio</div>
                <div className="font-semibold text-gray-900 text-sm">${(userData?.portfolioValue || 0).toFixed(0)}</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 mb-1">Total</div>
                <div className="font-bold text-blue-600 text-sm">${(userData?.totalValue || 0).toFixed(0)}</div>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-500">Signed in as</div>
              <div className="font-medium text-gray-900 truncate">{user?.username || 'User'}</div>
            </div>

            {/* Mobile Settings */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onExportData();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Export Data
              </button>
              <label className="w-full block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      onImportData(e.target.files[0]);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  onResetData();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Reset All Data
              </button>
              <hr className="my-2" />
              <button
                onClick={() => {
                  onSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;