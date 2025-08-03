// components/ui/StatusMessage.tsx
import React from 'react';
import { Upload } from 'lucide-react';

interface StatusMessageProps {
  isDarkMode: boolean;
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ isDarkMode, message }) => {
  return (
    <div className={`mt-6 p-4 rounded-xl border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-blue-900/20 border-blue-700/50 text-blue-300' 
        : 'bg-blue-50 border-blue-200 text-blue-700'
    }`}>
      <div className="flex items-center space-x-2">
        <Upload className="w-5 h-5" />
        <span className="font-medium">Files ready for upload</span>
      </div>
      <p className="text-sm mt-1 opacity-80">{message}</p>
    </div>
  );
};

export default StatusMessage;