import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  type = 'button',
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  const baseClasses = "w-full flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 shadow-sm hover:shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton;