import React from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
  isDarkMode: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, gradient, onClick, isDarkMode }) => (
  <div
    className={`group rounded-2xl p-8 shadow-sm border hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 ${
      isDarkMode
        ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70'
        : 'bg-white border-gray-100'
    }`}
    onClick={onClick}
  >
    <div
      className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h3
      className={`text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      {title}
    </h3>
    <p
      className={`leading-relaxed transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}
    >
      {description}
    </p>
    <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
      <span>Get Started</span>
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

export default ActionCard;