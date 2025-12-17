import React, { useState } from 'react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I return an item that was purchased incorrectly?"
    },
    {
      question: "What should you know before placing an order?"
    },
    {
      question: "How can I contact the customer service?"
    },
    {
      question: "How do I get interesting promotions?"
    },
    {
      question: "How to make payments online?"
    }
  ];

  return (
    <div className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          {/* Left Section */}
          <div className="flex flex-col justify-between space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black leading-tight font-main">
              Frequently<br/> Asked Question
            </h1>
            
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl text-black font-main">
                Still Have Other Questions?
              </h3>
              
              <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Contact Us
              </button>
            </div>
          </div>
          
          {/* Right Section - FAQ Items */}
          <div className="space-y-4 w-full lg:w-[63rem]">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left py-3 sm:py-4 focus:outline-none group"
                >
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 pr-4 sm:pr-8 leading-tight font-main">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg 
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-black font-bold transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="pb-4 pr-4 sm:pr-8 animate-fadeIn">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      This is where the answer to "{faq.question}" would appear. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Faq;