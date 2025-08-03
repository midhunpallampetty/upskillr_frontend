import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  isDarkMode: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient, isDarkMode }) => (
  <div
    className={`rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' : 'bg-white border-gray-100'
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white`}>
        {icon}
      </div>
      <span className="text-green-500 text-sm font-medium">●</span>
    </div>
    <p
      className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      {value}
    </p>
    <p
      className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
    >
      {title}
    </p>
  </div>
);

export default StatCard;