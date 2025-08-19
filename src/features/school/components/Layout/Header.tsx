// components/layout/Header.tsx
import React from 'react';
import { ArrowLeft, Building2, LogOut } from 'lucide-react';
import Button from '../UI/Button';
import { HeaderProps } from '../../types/HeaderProps';


const Header: React.FC<HeaderProps> = ({ isDarkMode, onBack, onLogout, title, subtitle }) => {
  return (
    <header className={`backdrop-blur-lg border-b sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700/20' 
        : 'bg-white/80 border-white/20'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            className={`p-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
              }`}>
                {title}
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;