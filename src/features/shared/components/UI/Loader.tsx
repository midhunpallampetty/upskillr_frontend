// ../shared/components/UI/LoadingButton.tsx
import React from 'react';
import { LoadingButtonProps } from '../../types/LoadingProps';

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',              // NEW default
  ...rest                           // allow extra props
}) => {
  // Simple Tailwind-style colour map
  const variantCls = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700',
  }[variant];

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`w-full text-white px-5 py-2 rounded shadow transition
                  duration-300 flex justify-center items-center gap-2
                  ${variantCls}
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
