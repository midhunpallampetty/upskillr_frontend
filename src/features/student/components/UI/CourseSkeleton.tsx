import React from 'react';

const CourseSkeleton = () => (
  <div className="animate-pulse px-4 md:px-10 py-6">
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl shadow-lg mb-10 flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/2 h-72 bg-gray-300 rounded-md" />
      <div className="p-8 md:w-1/2 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-5 shadow-md">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

export default CourseSkeleton;
