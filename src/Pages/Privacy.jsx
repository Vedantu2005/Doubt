import React from 'react';

const Privacy = () => {
  // Define the Privacy Policy content in a structured array
  const policyData = [
    {
      title: "Information We Collect",
      content: [
        "Personal details: such as your name, contact information, and payment details (processed securely).",
        "Order details: including items purchased, order history, and preferences.",
        "Technical data: such as cookies, device information, and browsing activity to improve your online experience.",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders.",
        "Communicate with you about your order or inquiries.",
        "Improve our products, services, and website.",
        "Send promotional messages, but only if you have opted in.",
      ],
    },
    {
      title: "Sharing of Information",
      content: [
        "We do not sell or rent your personal information. We only share it with:",
        "Trusted service providers, such as payment processors or delivery/pickup partners.",
        "Legal authorities, if required by law.",
      ],
    },
    {
      title: "Data Security",
      content: "We use secure systems and trusted third-party providers to protect your information. While we take all reasonable steps to safeguard your data, no online system can be guaranteed 100% secure.",
    },
    {
      title: "Your Rights",
      content: "You have the right to request access, correction, or deletion of your personal information. You may also opt out of receiving marketing communications at any time.",
    },
    {
      title: "Updates to This Policy",
      content: "We may update this Privacy Policy periodically. Any changes will be posted on this page with the updated date.",
    },
    {
      title: "Contact Us",
      contact: true, // Use a special flag to render the contact info
    },
  ];

  return (
    <div className="bg-gray-50 mt-15 py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          
          {/* Left Section - Header & Contact Button */}
          <div className="flex flex-col justify-between space-y-6 sm:space-y-8 lg:w-96 lg:flex-shrink-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black leading-tight font-main">
              Privacy<br/> Policy
            </h1>
            
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl text-black font-main">
                Questions or Concerns?
              </h3>
              
              <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Contact Us Now
              </button>
            </div>
          </div>
          
          {/* Right Section - Privacy Policy Content */}
          <div className="space-y-8 w-full">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              At <b>Boxcar Donuts</b>, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you place an order through our website.
            </p>
            
            {/* Map over the policyData to display each section */}
            <div className="space-y-6">
              {policyData.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight font-main">
                    {item.title}
                  </h2>
                  
                  {/* Logic for rendering standard content */}
                  {!item.contact && (
                    <div className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {/* Check if content is an array (for lists/bullet points) */}
                      {Array.isArray(item.content) ? (
                        <ul className="list-disc ml-5 space-y-1">
                          {item.content.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      ) : (
                        // If content is a single string (for paragraphs)
                        <p>{item.content}</p>
                      )}
                    </div>
                  )}

                  {/* Logic for rendering Contact Us details */}
                  {item.contact && (
                    <div className="text-gray-700 text-base sm:text-lg leading-relaxed font-semibold space-y-1">
                      <p>Boxcar Donuts</p>
                      <p>1673 Richmond St, London, Ontario</p>
                      <p>519-645-3000</p>
                      <p>Hello@boxcardonuts.ca</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;