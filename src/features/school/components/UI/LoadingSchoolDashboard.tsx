import React from 'react';
import { Loader2 } from 'lucide-react'; // optional, use any loader

const LoadingSchoolDashboard: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        <h2 className="text-xl font-semibold text-gray-800">Loading School Dashboard</h2>
        <p className="text-sm text-gray-600">Please wait while we fetch your school information…</p>
      </div>
    </div>
  );
};

export default LoadingSchoolDashboard;
