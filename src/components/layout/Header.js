// src/components/layout/Header.js
import React from 'react';
import { LogOut } from 'lucide-react';
import SettingsDropdown from '../common/SettingsDropdown';

const Header = ({ 
  user, 
  userData, 
  onSignOut, 
  onExportData, 
  onImportData, 
  onResetData 
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">StockSim</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              User: {user?.username || 'Anonymous'}
            </span>
            <span className="text-sm text-gray-600">
              Cash: ${(userData?.cash || 0).toFixed(2)}
            </span>
            <span className="text-sm font-semibold">
              Total: ${(userData?.totalValue || 0).toFixed(2)}
            </span>
            
            <SettingsDropdown
              onExportData={onExportData}
              onImportData={onImportData}
              onResetData={onResetData}
              onSignOut={onSignOut}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;