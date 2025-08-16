import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0">
          <div className="p-4 border-b border-gray-200">
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex justify-between">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="p-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="mb-2 p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <main className="flex-1 ml-80">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 bg-white/20 rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="w-96 h-8 bg-white/20 rounded animate-pulse" />
                <div className="w-48 h-5 bg-white/20 rounded animate-pulse" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-3">
                      <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-1 animate-pulse" />
                      <div className="w-12 h-6 bg-white/20 rounded mx-auto mb-1 animate-pulse" />
                      <div className="w-16 h-3 bg-white/20 rounded mx-auto animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-white/20 rounded animate-pulse" />
                  <div className="w-full h-3 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area Skeleton */}
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Loading Message */}
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Loading your course content...
              </h3>
              <p className="text-gray-500">
                Please wait while we prepare your learning experience
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoadingSkeleton;