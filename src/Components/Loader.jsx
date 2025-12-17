import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      {/* Minimal background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50"></div>

      {/* Main loader content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src="/Logo.png" 
            alt="Donatsu" 
            className="h-16 w-32 sm:h-20 sm:w-40 mx-auto object-contain"
          />
        </div>

        {/* Minimal donut spinner */}
        <div className="relative mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 animate-spin"></div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-main font-semibold text-gray-700 mb-2">
            Loading...
          </h2>
        </div>

        {/* Minimal progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
