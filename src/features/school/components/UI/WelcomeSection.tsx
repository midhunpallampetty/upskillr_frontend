import React from 'react';
import { useGlobalState } from '../../../../context/GlobalState';

interface WelcomeSectionProps {
  schoolName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ schoolName }) => {
  const { isDarkMode } = useGlobalState();

  return (
    <div className="mb-8">
      <h2
        className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Welcome back! 👋
      </h2>
      <p
        className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
      >
        Here's what's happening at {schoolName} today.
      </p>
    </div>
  );
};

export default WelcomeSection;