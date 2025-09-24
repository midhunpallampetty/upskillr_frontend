import React, { useState, useEffect } from "react";

interface PageLoaderProps {
  children: (isLoading: boolean) => React.ReactNode;
  delay?: number; // optional, simulate loading for demo
}

const PageLoader: React.FC<PageLoaderProps> = ({ children, delay = 1500 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fake delay just for demo
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-white">
          {/* Loader UI */}
          <div className="w-16 h-16 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        children(isLoading) // render props
      )}
    </>
  );
};

export default PageLoader;
