import React from 'react';
import { LoadingButtonProps } from '../../types/LoadingProps';

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  type = 'button',
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`w-full bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition duration-300 flex justify-center items-center gap-2 ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>
          <span>Submitting...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton;
