import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Oops! Something went wrong</h2>
      <p className="text-red-600 text-center mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorState;