// components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;