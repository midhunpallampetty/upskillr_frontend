import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Compass, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; scale: number; duration: number }>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate floating background elements
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.3 + Math.random() * 0.7,
      duration: 3 + Math.random() * 4
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-300/20 blur-xl"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `scale(${element.scale})`,
              animation: `float ${element.duration}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-2xl mx-auto px-6 transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* 404 Icon and Number */}
        <div className="mb-8 relative">
          <div className="inline-block relative">
            <AlertTriangle 
              size={80} 
              className="text-amber-500 mx-auto mb-4 animate-bounce" 
              style={{ animationDelay: '0.5s' }}
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-pulse leading-tight">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className={`transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry though, we'll help you find your way back!
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Link 
            to="/" 
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
          >
            <Home size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
        </div>

        {/* Additional Help Section */}
        <div className={`mt-12 transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p className="text-gray-500 mb-6">Looking for something specific?</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/search" 
              className="group flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
            >
              <Search size={18} className="group-hover:scale-110 transition-transform duration-300" />
              Search
            </Link>
            <Link 
              to="/explore" 
              className="group flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
            >
              <Compass size={18} className="group-hover:rotate-45 transition-transform duration-300" />
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* Error Code Display */}
      <div className={`absolute bottom-8 text-center transition-all duration-1000 delay-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <p className="text-sm text-gray-400">
          Error Code: 404 | Page Not Found
        </p>
      </div>

      {/* Custom CSS for floating animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
