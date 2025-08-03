import React from 'react';

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading School Dashboard</h2>
      <p className="text-lg text-gray-600">Please wait while we fetch your school information...</p>
    </div>
  </div>
);

export default LoadingState;