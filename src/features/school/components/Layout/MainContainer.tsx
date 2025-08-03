// components/layout/MainContainer.tsx
import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div className="w-full px-6 py-8 md:w-4/5 md:mx-auto">
      {children}
    </div>
  );
};

export default MainContainer;