import React from 'react';

interface LoadingCardProps {
  isDarkMode: boolean;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ isDarkMode }) => (
  <div
    className={`rounded-xl shadow-sm border p-6 ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white borderpink-100'
    }`}
  >
    <div className="h-6 bg-gray-200 rounded animate-pulse mb-6 w-48"></div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
      </div>
    ))}
  </div>
);

export default LoadingCard;