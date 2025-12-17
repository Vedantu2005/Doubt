import React from 'react';

const Terms = () => {
  // Define the terms and conditions content in a structured array
  const termsData = [
    {
      title: "Ordering & Payment",
      content: "All orders are subject to availability and confirmation. Payments must be completed at checkout using the accepted methods listed on our site. Prices are shown in CAD and include applicable taxes.",
    },
    {
      title: "Products",
      content: "Our donuts and drinks are handmade daily, so slight variations in size, appearance, or ingredients may occur. Product photos are for reference only. Please note that while we do our best to list allergens, cross-contamination may occur.",
    },
    {
      title: "Pickup & Delivery",
      content: "Orders must be picked up during the selected time. If delivery is available, estimated times may vary due to traffic or weather. Once prepared, orders cannot be changed or cancelled.",
    },
    {
      title: "Refunds & Replacements",
      content: "Because our products are perishable, all sales are final. If there’s an issue with your order, please contact us within the same day, and we’ll be happy to make it right.",
    },
    {
      title: "Privacy & Security",
      content: "We value your privacy. Customer information is handled securely and used only for order processing as outlined in our Privacy Policy.",
    },
    {
      title: "Intellectual Property",
      content: "All content on this website, including logos, photos, and text, is the property of Boxcar Donuts and may not be used without permission.",
    },
    {
      title: "Updates",
      content: "We may update these Terms & Conditions at any time. Continued use of our site means you accept any changes.",
    },
  ];

  return (
    <div className="bg-gray-50 mt-15 py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          
          {/* Left Section - Similar to FAQ Header */}
          <div className="flex flex-col justify-between space-y-6 sm:space-y-8 lg:w-96 lg:flex-shrink-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black leading-tight font-main">
              Terms &<br/> Conditions
            </h1>
            
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl text-black font-main">
                Need Clarification?
              </h3>
              
              <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Contact Us
              </button>
            </div>
          </div>
          
          {/* Right Section - Terms Content */}
          <div className="space-y-8 w-full">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Welcome to Boxcar Donuts! By using our website or placing an order, you agree to the following terms and conditions.
            </p>
            
            {/* Map over the termsData to display each section */}
            <div className="space-y-6">
              {termsData.map((term, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight font-main">
                    {term.title}
                  </h2>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;