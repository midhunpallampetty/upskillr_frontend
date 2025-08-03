import React from 'react';

interface LoadingGridProps {
  isDarkMode: boolean;
}

const LoadingGrid: React.FC<LoadingGridProps> = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`rounded-xl shadow-sm border overflow-hidden ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-100'
        }`}
      >
        <div className="h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingGrid;