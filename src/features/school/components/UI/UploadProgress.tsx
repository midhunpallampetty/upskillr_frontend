import React from 'react';
import { CheckCircle, Upload, Settings, Zap, AlertTriangle } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  stage: 'preparing' | 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
  isVisible: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  stage,
  message,
  isVisible,
}) => {
  const getStageIcon = () => {
    switch (stage) {
      case 'preparing':
        return <Settings className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'uploading':
        return <Upload className="w-6 h-6 text-blue-500 animate-bounce" />;
      case 'processing':
        return <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />;
      default:
        return <Upload className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'preparing':
        return 'bg-blue-500';
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-gray-50 rounded-full">
              {getStageIcon()}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                className={`transition-all duration-500 ease-out ${
                  stage === 'complete' ? 'text-green-500' : 
                  stage === 'processing' ? 'text-yellow-500' : 
                  stage === 'error' ? 'text-red-500' : 'text-blue-500'
                }`}
                style={{
                  filter: stage === 'complete' ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))' : 'none'
                }}
              />
            </svg>
            {/* Progress text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Stage indicator */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">
              {stage === 'preparing' && 'Preparing Upload'}
              {stage === 'uploading' && 'Uploading Video'}
              {stage === 'processing' && 'Processing Video'}
              {stage === 'complete' && 'Upload Complete!'}
              {stage === 'error' && 'Upload Failed'}
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${getStageColor()}`}
              style={{ 
                width: `${progress}%`,
                boxShadow: progress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
              }}
            />
          </div>

          {/* Stage steps */}
          <div className="flex justify-between text-xs text-gray-500">
            <div className={`flex flex-col items-center space-y-1 ${
              ['preparing', 'uploading', 'processing', 'complete'].indexOf(stage) >= 0 ? 'text-blue-600' : ''
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                ['preparing', 'uploading', 'processing', 'complete'].indexOf(stage) >= 0 ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
              <span>Prepare</span>
            </div>
            <div className={`flex flex-col items-center space-y-1 ${
              ['uploading', 'processing', 'complete'].indexOf(stage) >= 0 ? 'text-blue-600' : ''
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                ['uploading', 'processing', 'complete'].indexOf(stage) >= 0 ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
              <span>Upload</span>
            </div>
            <div className={`flex flex-col items-center space-y-1 ${
              ['processing', 'complete'].indexOf(stage) >= 0 ? 'text-yellow-600' : ''
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                ['processing', 'complete'].indexOf(stage) >= 0 ? 'bg-yellow-600' : 'bg-gray-300'
              }`} />
              <span>Process</span>
            </div>
            <div className={`flex flex-col items-center space-y-1 ${
              stage === 'complete' ? 'text-green-600' : ''
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                stage === 'complete' ? 'bg-green-600' : 'bg-gray-300'
              }`} />
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
