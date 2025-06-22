// src/components/layout/Navigation.js
import React from 'react';
import { Home, Briefcase, Activity } from 'lucide-react';
import { NAV_TABS } from '../../utils/constants';

const Navigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    {
      id: NAV_TABS.HOME,
      label: 'Home',
      icon: Home
    },
    {
      id: NAV_TABS.PORTFOLIO,
      label: 'Portfolio',
      icon: Briefcase
    },
    {
      id: NAV_TABS.TRADE,
      label: 'Trade',
      icon: Activity
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex flex-col items-center py-4 px-6 min-h-[72px] transition-colors ${
                activeTab === id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon size={28} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;