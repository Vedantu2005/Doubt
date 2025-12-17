import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setRotation(window.scrollY / 5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white">
      {/*Banner Section */}
      <div className="py-10 px-4">
        <div className="bg-[#5b392a] max-w-6xl mx-auto rounded-3xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-between text-center sm:text-left p-8 md:p-10 min-h-[260px]">
            
            {/* Text container */}
            <div className="mb-6 sm:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold">
                My Account
              </h1>
            </div>

            {/* Image container */}
            <div>
              <img 
                src="/banner2.png" 
                alt="Spinning Donut" 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 object-contain"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div 
        className="bg-cover bg-center pt-10 pb-16 sm:pb-24 px-4"
        style={{ backgroundImage: "url('https://kits.astylers.com/donatsu/wp-content/uploads/2023/07/bg-my-account.jpg')" }}
      >
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            
            {/* Form card with responsive padding */}
            <div className="bg-[#fbeee2] p-6 sm:p-10 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-6 text-center">
                Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
              </p>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="reset-email">
                    Username or email address
                  </label>
                  <input 
                    type="text" 
                    id="reset-email"
                    className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-[#d9822b] hover:bg-[#c37124] text-white font-bold py-3 px-8 rounded-md transition"
                  >
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;