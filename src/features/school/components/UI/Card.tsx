// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const Card: React.FC<CardProps> = ({ children, isDarkMode }) => {
  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300 w-full ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
        : 'bg-white border-gray-100'
    }`}>
      {children}
    </div>
  );
};

export default Card;