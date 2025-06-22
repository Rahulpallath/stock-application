// src/components/common/SettingsDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, Download, Upload, RefreshCw } from 'lucide-react';

const SettingsDropdown = ({ 
  onExportData, 
  onImportData, 
  onResetData, 
  onSignOut 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImportData(file);
      // Reset the input so the same file can be selected again
      event.target.value = '';
    }
  };

  const menuItems = [
    {
      icon: Download,
      label: 'Export Data',
      onClick: () => {
        onExportData();
        setIsOpen(false);
      }
    },
    {
      icon: Upload,
      label: 'Import Data',
      onClick: handleImportClick
    },
    {
      icon: RefreshCw,
      label: 'Reset All Data',
      onClick: () => {
        onResetData();
        setIsOpen(false);
      },
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
          <div className="py-1">
            {menuItems.map(({ icon: Icon, label, onClick, className = '' }) => (
              <button
                key={label}
                onClick={onClick}
                className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${className}`}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </button>
            ))}
            
            <hr className="my-1" />
            
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default SettingsDropdown;